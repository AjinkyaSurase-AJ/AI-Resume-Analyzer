const db = require("../config/db");

const create = async ({
  candidate_id,
  uploaded_by,
  file_name,
  original_name,
  extracted_text,
}) => {
  const [result] = await db.execute(
    "INSERT INTO resumes (candidate_id, uploaded_by, file_name, original_name, extracted_text) VALUES (?, ?, ?, ?, ?)",
    [
      candidate_id || null,
      uploaded_by,
      file_name,
      original_name || file_name,
      extracted_text,
    ],
  );
  return result.insertId;
};

const mapSkills = async (resumeId, skills) => {
  for (const skill of skills) {
    await db.execute(
      "INSERT IGNORE INTO resume_skills (resume_id, skill_id) VALUES (?, ?)",
      [resumeId, skill.skill_id],
    );
  }
};

const findById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM resumes WHERE resume_id = ?", [
    id,
  ]);
  return rows[0] || null;
};

const remove = async (id) => {
  const [result] = await db.execute("DELETE FROM resumes WHERE resume_id = ?", [
    id,
  ]);
  return result.affectedRows;
};

const list = async ({ limit, offset, user }) => {
  const values = [];
  let where = "";

  if (user.role === "candidate") {
    where = "WHERE candidate_id = ?";
    values.push(user.user_id);
  } else if (user.role === "recruiter") {
    where = "WHERE uploaded_by = ? AND candidate_id IS NULL";
    values.push(user.user_id);
  }

  const sql = `SELECT
    r.resume_id,
    r.original_name,
    r.upload_date,
    rs.ats_score
FROM resumes r
LEFT JOIN results rs
    ON rs.resume_id = r.resume_id
${where}
ORDER BY r.resume_id DESC
LIMIT ${parseInt(limit, 10)}
OFFSET ${parseInt(offset, 10)}`;

  const [records] = await db.execute(sql, values);

  const [count] = await db.execute(
    `SELECT COUNT(*) AS total
     FROM resumes
     ${where}`,
    values,
  );

  return {
    records,
    total: count[0].total,
  };
};

module.exports = { create, mapSkills, findById, remove, list };

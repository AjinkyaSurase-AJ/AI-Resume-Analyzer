const db = require("../config/db");

const create = async ({
  recruiter_id,
  title,
  description,
  experience_required,
}) => {
  const [result] = await db.execute(
    "INSERT INTO job_descriptions (recruiter_id, title, description, experience_required) VALUES (?, ?, ?, ?)",
    [recruiter_id, title, description, experience_required || null],
  );
  return result.insertId;
};

const mapSkills = async (jdId, skills) => {
  for (const skill of skills) {
    await db.execute(
      "INSERT IGNORE INTO jd_skills (jd_id, skill_id) VALUES (?, ?)",
      [jdId, skill.skill_id],
    );
  }
};

const findById = async (id) => {
  const [rows] = await db.execute(
    "SELECT * FROM job_descriptions WHERE jd_id = ?",
    [id],
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const [result] = await db.execute(
    "DELETE FROM job_descriptions WHERE jd_id = ?",
    [id],
  );
  return result.affectedRows;
};

const list = async ({ limit, offset, user }) => {
  const values = [];
  let where = "";

  if (user.role === "recruiter") {
    where = "WHERE recruiter_id = ?";
    values.push(user.user_id);
  }

  const safeLimit = Number(limit);
  const safeOffset = Number(offset);

  const sql = `
    SELECT *
    FROM job_descriptions
    ${where}
    ORDER BY jd_id DESC
    LIMIT ${safeLimit}
    OFFSET ${safeOffset}
  `;

  const [records] = await db.query(sql, values);

  const [count] = await db.execute(
    `SELECT COUNT(*) AS total
     FROM job_descriptions
     ${where}`,
    values,
  );

  return {
    records,
    total: count[0].total,
  };
};

module.exports = { create, mapSkills, findById, remove, list };

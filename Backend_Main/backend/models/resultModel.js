const db = require("../config/db");

const create = async ({
  resume_id,
  jd_id,
  ats_score,
  quality_label,
  summary,
}) => {
  const [result] = await db.execute(
    "INSERT INTO results (resume_id, jd_id, ats_score, quality_label, summary) VALUES (?, ?, ?, ?, ?)",
    [resume_id, jd_id, ats_score, quality_label, summary],
  );
  return result.insertId;
};

const allowedSkillTables = ["matched_skills", "missing_skills"];

const addSkillRows = async (table, resultId, skills) => {
  if (!allowedSkillTables.includes(table)) {
    throw new Error(`Invalid skill table name: ${table}`);
  }
  for (const skill of skills) {
    await db.execute(
      `INSERT IGNORE INTO ${table} (result_id, skill_id) VALUES (?, ?)`,
      [resultId, skill.skill_id],
    );
  }
};

const setRanking = async (resultId, rank) => {
  await db.execute("UPDATE results SET ranking = ? WHERE result_id = ?", [
    rank,
    resultId,
  ]);
};

const findById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM results WHERE result_id = ?", [
    id,
  ]);
  return rows[0] || null;
};

const findByResumeId = async (resumeId) => {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM results
    WHERE resume_id = ?
    ORDER BY result_id DESC
    LIMIT 1
    `,
    [resumeId],
  );

  return rows[0] || null;
};

const getMatchedSkills = async (resultId) => {
  const [rows] = await db.execute(
    `
        SELECT s.skill_name

        FROM matched_skills ms

        JOIN skills s

        ON ms.skill_id = s.skill_id

        WHERE ms.result_id = ?
        `,
    [resultId],
  );

  return rows.map((row) => row.skill_name);
};

const getMissingSkills = async (resultId) => {
  const [rows] = await db.execute(
    `
        SELECT s.skill_name

        FROM missing_skills ms

        JOIN skills s

        ON ms.skill_id = s.skill_id

        WHERE ms.result_id = ?
        `,
    [resultId],
  );

  return rows.map((row) => row.skill_name);
};

const list = async ({ limit, offset, user, resume_id, jd_id }) => {
  const values = [];
  const filters = [];

  if (resume_id) {
    filters.push("r.resume_id = ?");
    values.push(resume_id);
  }

  if (jd_id) {
    filters.push("r.jd_id = ?");
    values.push(jd_id);
  }

  if (user.role === "candidate") {
    filters.push("re.candidate_id = ?");
    values.push(user.user_id);
  } else if (user.role === "recruiter") {
    filters.push("jd.recruiter_id = ?");
    values.push(user.user_id);
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const fromSql = `
    FROM results r
    JOIN resumes re ON re.resume_id = r.resume_id
    JOIN job_descriptions jd ON jd.jd_id = r.jd_id
    ${where}
  `;

  const safeLimit = Number(limit);
  const safeOffset = Number(offset);

  const sql = `
    SELECT r.*, re.original_name, jd.title
    ${fromSql}
    ORDER BY r.ats_score DESC, r.result_id DESC
    LIMIT ${safeLimit}
    OFFSET ${safeOffset}
  `;

  const [records] = await db.query(sql, values);

  const [count] = await db.execute(
    `SELECT COUNT(*) AS total ${fromSql}`,
    values,
  );

  return {
    records,
    total: count[0].total,
  };
};

const rankedByJd = async ({ jdId, user }) => {
  const values = [jdId];
  const filters = ["r.jd_id = ?"];
  if (user.role === "recruiter") {
    filters.push("jd.recruiter_id = ?");
    values.push(user.user_id);
  }
  const [rows] = await db.execute(
    `SELECT r.*, re.original_name, jd.title
     FROM results r
     JOIN resumes re ON re.resume_id = r.resume_id
     JOIN job_descriptions jd ON jd.jd_id = r.jd_id
     WHERE ${filters.join(" AND ")}
     ORDER BY r.ats_score DESC, r.result_id ASC`,
    values,
  );
  return rows;
};

const skillsForResult = async (resultId, table) => {
  if (!allowedSkillTables.includes(table)) {
    throw new Error(`Invalid skill table name: ${table}`);
  }
  const [rows] = await db.execute(
    `SELECT s.skill_name
     FROM skills s
     JOIN ${table} x ON x.skill_id = s.skill_id
     WHERE x.result_id = ?
     ORDER BY s.skill_name`,
    [resultId],
  );
  return rows.map((row) => row.skill_name);
};

module.exports = {
  create,
  addSkillRows,
  setRanking,
  findById,
  findByResumeId,
  getMatchedSkills,
  getMissingSkills,
  list,
  rankedByJd,
  skillsForResult,
};

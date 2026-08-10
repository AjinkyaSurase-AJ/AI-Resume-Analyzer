const db = require("../config/db");

const normalize = (skill) => skill.trim().toLowerCase();

const findOrCreate = async (skillName) => {
  const name = normalize(skillName);
  await db.execute("INSERT IGNORE INTO skills (skill_name) VALUES (?)", [name]);
  const [rows] = await db.execute(
    "SELECT skill_id, skill_name FROM skills WHERE skill_name = ?",
    [name],
  );
  return rows[0];
};

const findManyByNames = async (names = []) => {
  if (!Array.isArray(names)) {
    return [];
  }

  const skills = [];

  const uniqueNames = [
    ...new Set(
      names
        .filter((name) => typeof name === "string")
        .map(normalize)
        .filter(Boolean),
    ),
  ];

  for (const name of uniqueNames) {
    skills.push(await findOrCreate(name));
  }

  return skills;
};
const list = async ({ limit, offset }) => {
  const safeLimit = Number(limit) || 10;
  const safeOffset = Number(offset) || 0;
  const sql = `SELECT * FROM skills ORDER BY skill_name LIMIT ${safeLimit} OFFSET ${safeOffset}`;
  const [records] = await db.query(sql);
  const [count] = await db.execute("SELECT COUNT(*) total FROM skills");
  return { records, total: count[0].total };
};

const create = async (skillName) => findOrCreate(skillName);

const byResume = async (resumeId) => {
  const [rows] = await db.execute(
    "SELECT s.skill_id, s.skill_name FROM skills s JOIN resume_skills rs ON rs.skill_id = s.skill_id WHERE rs.resume_id = ? ORDER BY s.skill_name",
    [resumeId],
  );
  return rows;
};

const byJd = async (jdId) => {
  const [rows] = await db.execute(
    "SELECT s.skill_id, s.skill_name FROM skills s JOIN jd_skills js ON js.skill_id = s.skill_id WHERE js.jd_id = ? ORDER BY s.skill_name",
    [jdId],
  );
  return rows;
};

module.exports = {
  create,
  findOrCreate,
  findManyByNames,
  list,
  byResume,
  byJd,
};

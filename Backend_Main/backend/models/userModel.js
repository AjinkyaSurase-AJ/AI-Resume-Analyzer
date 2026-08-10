const db = require("../config/db");

const publicFields = "user_id, name, email, role, registration_date";

const create = async ({ name, email, password, role }) => {
  const [result] = await db.execute(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role],
  );
  return result.insertId;
};

const findByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT ${publicFields} FROM users WHERE user_id = ?`,
    [id],
  );
  return rows[0] || null;
};

const update = async (id, payload) => {
  const allowed = ["name", "email", "password", "role"];
  const keys = Object.keys(payload).filter(
    (key) => allowed.includes(key) && payload[key] !== undefined,
  );
  if (!keys.length) return 0;
  const setSql = keys.map((key) => `${key} = ?`).join(", ");
  const [result] = await db.execute(
    `UPDATE users SET ${setSql} WHERE user_id = ?`,
    [...keys.map((key) => payload[key]), id],
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await db.execute("DELETE FROM users WHERE user_id = ?", [
    id,
  ]);
  return result.affectedRows;
};

const list = async ({ limit, offset, role }) => {
  const values = [];
  let where = "";
  if (role) {
    where = "WHERE role = ?";
    values.push(role);
  }
  
  const sql = `
    SELECT ${publicFields}
    FROM users
    ${where}
    ORDER BY user_id DESC
    LIMIT ${Number(limit)}
    OFFSET ${Number(offset)}
    `;
  const [records] = await db.query(sql, values);

  const [count] = await db.execute(
    `SELECT COUNT(*) total FROM users ${where}`,
    values,
  );
  return { records, total: count[0].total };
};

const findByIdWithPassword = async (id) => {
  const [rows] = await db.execute(
    `SELECT user_id, name, email, role, password
     FROM users
     WHERE user_id = ?`,
    [id],
  );

  return rows[0] || null;
};

const changePassword = async (userId, password) => {
  await db.execute("UPDATE users SET password = ? WHERE user_id = ?", [
    password,
    userId,
  ]);
};

module.exports = {
  create,
  findByEmail,
  findById,
  update,
  remove,
  list,
  findByIdWithPassword,
  changePassword,
};

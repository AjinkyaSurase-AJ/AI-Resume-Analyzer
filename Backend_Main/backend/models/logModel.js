const db = require("../config/db");

const create = async ({ user_id, event, description, ip_address }) => {
  try {
    await db.execute(
      "INSERT INTO logs (user_id, event, description, ip_address) VALUES (?, ?, ?, ?)",
      [user_id || null, event, description || "", ip_address || null],
    );
  } catch (ex) {
    if (process.env.NODE_ENV !== "production") console.log(ex.message);
  }
};

const list = async ({ limit, offset }) => {
  const safeLimit = Number(limit);
  const safeOffset = Number(offset);

  const sql = `
    SELECT *
    FROM logs
    ORDER BY log_id DESC
    LIMIT ${safeLimit}
    OFFSET ${safeOffset}
  `;

  const [records] = await db.query(sql);

  const [count] = await db.execute(
    "SELECT COUNT(*) AS total FROM logs"
  );

  return {
    records,
    total: count[0].total,
  };
};

module.exports = { create, list };

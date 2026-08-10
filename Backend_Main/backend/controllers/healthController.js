const db = require("../config/db");

const healthCheck = async (req, res) => {
  try {
    await db.query("SELECT 1");
    return res.status(200).json({
      success: true,
      message: "AI Resume Analyzer backend is healthy",
      data: {
        server: "UP",
        database: "CONNECTED",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Health check database error:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error stack:", error.stack);

    return res.status(503).json({
      success: false,
      message: "Backend is running but database is unavailable",
      data: {
        server: "UP",
        database: "DISCONNECTED",
        timestamp: new Date().toISOString(),
      },
    });
  }
};

module.exports = {
  healthCheck,
};

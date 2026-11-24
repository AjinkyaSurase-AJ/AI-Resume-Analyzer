const healthStatus = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Dummy health status endpoint is working",
    data: {
      status: "UP",
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = {
  healthStatus,
};
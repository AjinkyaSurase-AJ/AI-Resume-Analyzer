const { error } = require("../utils/response");

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return error(res, "You are not authorized to access this resource", 403);
    }

    const userRole = req.user.role.toLowerCase();

    if (!roles.map((role) => role.toLowerCase()).includes(userRole)) {
      return error(res, "You are not authorized to access this resource", 403);
    }

    return next();
  };

module.exports = authorize;

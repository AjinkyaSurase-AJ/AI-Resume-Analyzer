const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { error } = require("../utils/response");

const authenticate = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token)
    return error(res, "Authentication token is required", 401);

  try {
    req.user = jwt.verify(token, config.jwtSecret);
    return next();
  } catch (ex) {
    if (ex.name === "TokenExpiredError")
      return error(res, "Session expired. Please login again.", 401);
    return error(res, "Invalid authentication token", 401);
  }
};

module.exports = authenticate;

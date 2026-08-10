const bcrypt = require("bcrypt");
const ApiError = require("../utils/apiError");
const userModel = require("../models/userModel");

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await userModel.findByIdWithPassword(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  if (currentPassword === newPassword) {
    throw new ApiError(
      400,
      "New password must be different from the current password",
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userModel.changePassword(userId, hashedPassword);
};

module.exports = {
  changePassword,
};

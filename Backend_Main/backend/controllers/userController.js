const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const config = require("../config/config");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const { success } = require("../utils/response");
const { getPagination, paged } = require("../utils/pagination");
const logService = require("../services/logService");
const userService = require("../services/userService")

const tokenFor = (user) =>
  jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );

exports.signup = asyncHandler(async (req, res) => {
  if (req.body.role === "admin")
    throw new ApiError(
      400,
      "Admin role cannot be assigned during signup. Please register as candidate or recruiter.",
    );
  const existing = await userModel.findByEmail(req.body.email);
  if (existing) throw new ApiError(409, "Email is already registered");
  const password = await bcrypt.hash(req.body.password, 10);
  const role = req.body.role || "candidate";
  const userId = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password,
    role,
  });
  const user = await userModel.findById(userId);
  req.user = user;
  await logService.write(req, "user_signup", "User registered successfully");
  success(res, "Signup successful", { user, token: tokenFor(user) }, 201);
});

exports.signin = asyncHandler(async (req, res) => {
  const user = await userModel.findByEmail(req.body.email);
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    throw new ApiError(401, "Invalid email or password");
  const publicUser = await userModel.findById(user.user_id);
  req.user = publicUser;
  await logService.write(req, "user_login", "User logged in successfully");
  success(res, "Signin successful", {
    user: publicUser,
    token: tokenFor(publicUser),
  });
});

exports.profile = asyncHandler(async (req, res) => {
  success(
    res,
    "Profile fetched successfully",
    await userModel.findById(req.user.user_id),
  );
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const payload = { name: req.body.name, email: req.body.email };
  if (req.body.password)
    payload.password = await bcrypt.hash(req.body.password, 10);
  await userModel.update(req.user.user_id, payload);
  success(
    res,
    "Profile updated successfully",
    await userModel.findById(req.user.user_id),
  );
});

exports.list = asyncHandler(async (req, res) => {
  const paging = getPagination(req.query);
  const result = await userModel.list({ ...paging, role: req.query.role });
  success(
    res,
    "Records fetched successfully",
    paged(result.records, result.total, paging.page, paging.limit),
  );
});

exports.remove = asyncHandler(async (req, res) => {
  const affected = await userModel.remove(req.params.id);
  if (!affected) throw new ApiError(404, "User not found");
  await logService.write(
    req,
    "user_deleted",
    `Admin deleted user ${req.params.id}`,
  );
  success(res, "User deleted successfully");
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  await userService.changePassword(
    req.user.user_id,
    currentPassword,
    newPassword
  )

  success(res, "Password Change Successfully")
});

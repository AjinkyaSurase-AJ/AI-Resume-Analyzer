const userModel = require("../models/userModel");
const resumeModel = require("../models/resumeModel");
const jdModel = require("../models/jobDescriptionModel");
const resultModel = require("../models/resultModel");
const logModel = require("../models/logModel");
const resumeService = require("../services/resumeService");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");
const { getPagination, paged } = require("../utils/pagination");

exports.dashboard = asyncHandler(async (req, res) => {
  const paging = { limit: 1, offset: 0 };
  const [users, resumes, jds, results, logs] = await Promise.all([
    userModel.list(paging),
    resumeModel.list({ ...paging, user: req.user }),
    jdModel.list({ ...paging, user: req.user }),
    resultModel.list({ ...paging, user: req.user }),
    logModel.list(paging),
  ]);
  success(res, "Dashboard fetched successfully", {
    users: users.total,
    resumes: resumes.total,
    job_descriptions: jds.total,
    results: results.total,
    logs: logs.total,
  });
});

exports.users = asyncHandler(async (req, res) => {
  const paging = getPagination(req.query);
  const result = await userModel.list({ ...paging, role: req.query.role });
  success(
    res,
    "Records fetched successfully",
    paged(result.records, result.total, paging.page, paging.limit),
  );
});

exports.resumes = asyncHandler(async (req, res) => {
  const paging = getPagination(req.query);
  const result = await resumeModel.list({ ...paging, user: req.user });
  success(
    res,
    "Records fetched successfully",
    paged(result.records, result.total, paging.page, paging.limit),
  );
});

exports.jds = asyncHandler(async (req, res) => {
  const paging = getPagination(req.query);
  const result = await jdModel.list({ ...paging, user: req.user });
  success(
    res,
    "Records fetched successfully",
    paged(result.records, result.total, paging.page, paging.limit),
  );
});

exports.results = asyncHandler(async (req, res) => {
  const paging = getPagination(req.query);
  const result = await resultModel.list({ ...paging, user: req.user });
  success(
    res,
    "Records fetched successfully",
    paged(result.records, result.total, paging.page, paging.limit),
  );
});

exports.logs = asyncHandler(async (req, res) => {
  const paging = getPagination(req.query);
  const result = await logModel.list(paging);
  success(
    res,
    "Records fetched successfully",
    paged(result.records, result.total, paging.page, paging.limit),
  );
});

exports.deleteResume = asyncHandler(async (req, res) => {
  await resumeService.deleteResume(req.params.resumeId)

  success(res, "Resume Deleted Successfully")
})

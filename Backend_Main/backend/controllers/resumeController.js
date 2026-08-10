const resumeModel = require("../models/resumeModel");
const skillModel = require("../models/skillModel");
const analysisService = require("../services/analysisService");
const resumeService = require("../services/resumeService");
const logService = require("../services/logService");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const { success } = require("../utils/response");
const { getPagination, paged } = require("../utils/pagination");

exports.upload = asyncHandler(async (req, res) => {
  console.log("\n========== RESUME UPLOAD REQUEST ==========");
  console.log("REQ BODY:", req.body);
  console.log("REQ FILE:", {
    filename: req.file?.filename,
    originalname: req.file?.originalname,
    path: req.file?.path,
    mimetype: req.file?.mimetype,
    size: req.file?.size,
  });
  console.log("==========================================\n");

  if (!req.file) throw new ApiError(400, "Resume file is required");

  // Extract job description from request - can be in body, query, or form data
  // Made optional for initial resume upload without JD
  const jobDescription =
    req.body.jd_text || req.body.job_description || req.query.jd_text || "";

  console.log(
    "Extracted JD Text:",
    jobDescription.substring(0, 100) || "(empty)",
  );

  const candidateId = req.user.role === "candidate" ? req.user.user_id : null;

  const resume = await analysisService.runAnalysis({
    file: req.file,
    user: req.user,
    candidate_id: candidateId,
    jd_title: req.body.jd_title || "Resume Analysis",
    jd_text: jobDescription,
    experience_required: req.body.experience_required || null,
  });

  await logService.write(
    req,
    "resume_upload",
    `Resume ${resume.resume_id} uploaded`,
  );
  success(res, "Resume uploaded successfully", resume, 201);
});

exports.list = asyncHandler(async (req, res) => {
  const paging = getPagination(req.query);

  console.log("Paging:", paging);
  console.log("Query:", req.query);
  
  const result = await resumeModel.list({ ...paging, user: req.user });
  success(
    res,
    "Records fetched successfully",
    paged(result.records, result.total, paging.page, paging.limit),
  );
});

exports.getOne = asyncHandler(async (req, res) => {
  const resume = await resumeModel.findById(req.params.id);
  if (!resume) throw new ApiError(404, "Resume not found");
  analysisService.ensureOwnership(resume, req.user, "resume");
  resume.skills = await skillModel.byResume(req.params.id);
  success(res, "Resume fetched successfully", resume);
});

exports.remove = asyncHandler(async (req, res) => {
  const resume = await resumeModel.findById(req.params.id);
  if (!resume) throw new ApiError(404, "Resume not found");
  analysisService.ensureOwnership(resume, req.user, "resume");
  await resumeService.deleteResume(req.params.id);
  await logService.write(
    req,
    "resume_deleted",
    `Resume ${req.params.id} deleted`,
  );
  success(res, "Resume deleted successfully");
});

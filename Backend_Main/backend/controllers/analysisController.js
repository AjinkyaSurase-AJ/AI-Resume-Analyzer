const analysisService = require("../services/analysisService");
const logService = require("../services/logService");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const { success } = require("../utils/response");

exports.candidateAnalysis = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }

  const jobDescriptionText = req.body.jd_text || req.body.job_description || "";

  const output = await analysisService.runAnalysis({
    file: req.file,

    user: req.user,

    candidate_id: req.user.role === "candidate" ? req.user.user_id : null,

    jd_title: req.body.jd_title || "Candidate JD",

    jd_text: jobDescriptionText,

    experience_required: req.body.experience_required || "",
  });

  await logService.write(
    req,
    "analysis_run",
    `Analysis ${output.result_id} completed`,
  );

  success(res, "Analysis completed successfully", output, 201);
});

exports.getAnalysisResult = asyncHandler(async (req, res) => {
  const result = await analysisService.getAnalysisResult(
    req.params.resumeId,
    req.user,
  );

  success(res, "Analysis fetched successfully", result);
});

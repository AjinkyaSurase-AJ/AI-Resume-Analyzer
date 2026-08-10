const resumeModel = require("../models/resumeModel");
const jdModel = require("../models/jobDescriptionModel");
const skillModel = require("../models/skillModel");
const resultModel = require("../models/resultModel");
const recommendationModel = require("../models/recommendationModel");

const pythonAI = require("./pythonAIService");
const ApiError = require("../utils/apiError");

const ensureOwnership = (record, user, type) => {
  if (!record || !user) {
    throw new ApiError(400, "Record and user are required");
  }

  if (user.role === "admin") return true;

  if (
    type === "resume" &&
    user.role === "candidate" &&
    record.candidate_id !== user.user_id
  ) {
    throw new ApiError(403, "You can access only your own resumes");
  }

  if (
    type === "resume" &&
    user.role === "recruiter" &&
    record.uploaded_by !== user.user_id
  ) {
    throw new ApiError(403, "You can access only your own resumes");
  }

  if (
    type === "jd" &&
    user.role === "recruiter" &&
    record.recruiter_id !== user.user_id
  ) {
    throw new ApiError(403, "You can access only your own job descriptions");
  }

  return true;
};

const runAnalysis = async ({
  file,
  user,
  candidate_id,
  jd_id,
  jd_title,
  jd_text,
  experience_required,
}) => {
  // Validate required inputs
  if (!file || !user) {
    throw new ApiError(400, "File and user are required");
  }

  if (user.role === "candidate" && !candidate_id) {
    throw new ApiError(400, "candidate_id is required for candidate analysis");
  }

  if (!file.path || !file.filename || !file.originalname) {
    throw new ApiError(400, "Invalid file object");
  }

  if (!user.user_id || !user.role) {
    throw new ApiError(400, "Invalid user object");
  }

  const aiResult = await pythonAI.analyzeResume(file.path, jd_text || "");

  // Validate AI response
  if (!aiResult || typeof aiResult !== "object") {
    throw new ApiError(500, "Invalid response from AI service");
  }

  // Safely extract data with defaults
  const resumeText = aiResult?.resume_data?.resume_text || "";
  const resumeSkillsList = aiResult?.resume_data?.skills || [];
  const jobSkillsList = aiResult?.job_data?.skills || [];

  // Extract ATS result data - LOG EVERYTHING
  const atsScore = aiResult?.ats_result?.ATS_score || 0;

  const matchedSkillsList = aiResult?.ats_result?.skills?.matched_skills || [];
  const missingSkillsList = aiResult?.ats_result?.skills?.missing_skills || [];

  // Extract recommendation data
  const feedback = (aiResult?.recommendation?.feedback || "").substring(0, 255);
  let recommendationsList = aiResult?.recommendation?.recommendations || [];

  if (!Array.isArray(recommendationsList) || recommendationsList.length === 0) {
    recommendationsList = [
      "Highlight key technical skills relevant to the target role in your summary section.",
      "Quantify your career accomplishments using clear metrics and measurable outcomes.",
      "Align project descriptions with the core qualifications listed in the job post.",
    ];
    if (missingSkillsList.length > 0) {
      recommendationsList.unshift(`Consider adding relevant experience or certifications for: ${missingSkillsList.slice(0, 3).join(', ')}.`);
    }
  }

  // Save Resume
  const resumeId = await resumeModel.create({
    candidate_id,
    uploaded_by: user.user_id,
    file_name: file.filename,
    original_name: file.originalname,
    extracted_text: resumeText,
  });

  // Save Resume Skills
  const resumeSkills = await skillModel.findManyByNames(resumeSkillsList);

  await resumeModel.mapSkills(resumeId, resumeSkills);

  // A recruiter batch creates one JD and reuses it for every uploaded resume.
  // Candidate analysis retains the original one-resume/one-JD behaviour.
  let jdId = jd_id;
  if (!jdId) {
    jdId = await jdModel.create({
      recruiter_id: user.user_id,
      title: jd_title || "Resume Upload",
      description: jd_text || "",
      experience_required: experience_required ?? null,
    });

    const jdSkills = await skillModel.findManyByNames(jobSkillsList);
    await jdModel.mapSkills(jdId, jdSkills);
  }

  // Save Result
  const resultId = await resultModel.create({
    resume_id: resumeId,
    jd_id: jdId,
    ats_score: atsScore,
    quality_label: feedback || "Analysis Complete",
    summary: feedback || "",
  });

  // Save Matched Skills
  const matched = await skillModel.findManyByNames(matchedSkillsList);

  await resultModel.addSkillRows("matched_skills", resultId, matched);

  // Save Missing Skills
  const missing = await skillModel.findManyByNames(missingSkillsList);

  await resultModel.addSkillRows("missing_skills", resultId, missing);

  // Save Recommendations
  await recommendationModel.createMany(resultId, recommendationsList);

  return {
    result_id: resultId,
    resume_id: resumeId,
    jd_id: jdId,
    ats_score: atsScore,
    quality_label: feedback || "Analysis Complete",
    summary: feedback || "",
    resume_skills: resumeSkillsList,
    matched_skills: matchedSkillsList,
    missing_skills: missingSkillsList,
    recommendations: recommendationsList,
  };
};

const getAnalysisResult = async (resumeId, user) => {
  const resume = await resumeModel.findById(resumeId);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  ensureOwnership(resume, user, "resume");

  const result = await resultModel.findByResumeId(resumeId);

  if (!result) {
    throw new ApiError(404, "Analysis not found");
  }

  const resumeSkills = (await skillModel.byResume(resumeId)).map(
    (skill) => skill.skill_name,
  );

  const matchedSkills = await resultModel.skillsForResult(
    result.result_id,
    "matched_skills",
  );

  const missingSkills = await resultModel.skillsForResult(
    result.result_id,
    "missing_skills",
  );

  const recommendations = await recommendationModel.byResult(result.result_id);

  return {
    resume_id: resume.resume_id,
    resume_name: resume.original_name,
    upload_date: resume.upload_date,

    ats_score: result.ats_score,
    quality_label: result.quality_label,
    summary: result.summary,

    resume_skills: resumeSkills,
    matched_skills: matchedSkills,
    missing_skills: missingSkills,
    recommendations,
  };
};

module.exports = {
  ensureOwnership,
  runAnalysis,
  getAnalysisResult,
};

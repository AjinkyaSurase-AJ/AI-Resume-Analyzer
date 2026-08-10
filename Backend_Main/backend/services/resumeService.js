const fs = require("fs");
const path = require("path");
const config = require("../config/config");
const resumeModel = require("../models/resumeModel");
const ApiError = require("../utils/apiError");

const deleteResume = async (resumeId) => {
  const resume = await resumeModel.findById(resumeId);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  if (resume.file_name) {
    const uploadDir = path.resolve(config.uploadDir);
    const filePath = path.join(uploadDir, resume.file_name);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete physical resume file:", err.message);
      }
    }
  }

  await resumeModel.remove(resumeId);
};

module.exports = {
  deleteResume,
};
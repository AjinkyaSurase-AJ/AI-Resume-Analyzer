const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const ApiError = require("../utils/apiError");

const analyzeResume = async (resumePath, jobDescription) => {
  try {
    if (!resumePath || !fs.existsSync(resumePath)) {
      throw new ApiError(404, `Resume file not found: ${resumePath}`);
    }

    const form = new FormData();
    const fileStream = fs.createReadStream(resumePath);
    const filename = resumePath.split(/[\\\/]/).pop();

    form.append("resume", fileStream, { filename });
    const jdValue = jobDescription && jobDescription.trim() ? jobDescription.trim() : "";
    form.append("job_description", jdValue);

    const response = await axios.post(
      "http://127.0.0.1:8000/analyze",
      form,
      {
        headers: form.getHeaders(),
        timeout: 120000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.code === 'ECONNREFUSED') {
      throw new ApiError(503, "Python AI Analysis service is currently unreachable (port 8000). Please ensure the Python service is running.");
    }
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      throw new ApiError(504, "Python AI Analysis service request timed out. Please try again.");
    }
    if (error.response) {
      if (error.response.status === 422) {
        throw new ApiError(422, error.response.data?.detail?.[0]?.msg || "Invalid format or unprocessable resume document");
      }
      throw new ApiError(error.response.status, typeof error.response.data?.detail === 'string' ? error.response.data.detail : "AI Analysis service error");
    }
    throw error;
  }
};

module.exports = {
  analyzeResume
};
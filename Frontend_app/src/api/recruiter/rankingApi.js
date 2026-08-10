import apiClient from "../apiClient";
import config from "../../utils/config";

const appendResumeFiles = (formData, resumes) => {
  resumes.forEach((resume) => {
    formData.append("resumes", {
      uri: resume.uri,
      name: resume.name,
      type: resume.mimeType || "application/octet-stream",
    });
  });
};

export const analyzeRecruiterResumes = async (
  resumes,
  jobDescriptionText,
  jobTitle = "",
) => {
  const formData = new FormData();
  appendResumeFiles(formData, resumes);
  formData.append("jd_text", jobDescriptionText.trim());
  if (jobTitle.trim()) formData.append("jd_title", jobTitle.trim());

  const serverUrl = config.BASE_URL.replace(/\/api\/?$/, "");
  const response = await apiClient.post(
    `${serverUrl}/recruiter/analyze`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};

export const rankResumesForJob = async (jobDescriptionId, resumes) => {
  const formData = new FormData();
  appendResumeFiles(formData, resumes);

  const response = await apiClient.post(
    `/rankings/${jobDescriptionId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};

export const getRankings = async (jobDescriptionId) => {
  const response = await apiClient.get(`/rankings/${jobDescriptionId}`);
  return response.data;
};

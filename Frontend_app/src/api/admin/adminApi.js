import apiClient from "../apiClient";

export const getDashboard = async () => {
  const response = await apiClient.get("/admin/dashboard");
  return response.data;
};

export const getAdminUsers = async (role, page = 1, limit = 100) => {
  const params = { page, limit };
  if (role) params.role = role;
  const response = await apiClient.get("/admin/users", { params });
  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await apiClient.delete(`/admin/users/${userId}`);
  return response.data;
};

export const getAdminJobDescriptions = async (page = 1, limit = 100) => {
  const response = await apiClient.get("/admin/jds", {
    params: { page, limit },
  });
  return response.data;
};

export const getAdminResults = async (page = 1, limit = 100) => {
  const response = await apiClient.get("/admin/results", {
    params: { page, limit },
  });
  return response.data;
};

export const getResult = async (resultId) => {
  const response = await apiClient.get(`/results/${resultId}`);
  return response.data;
};

export const getResultRecommendations = async (resultId) => {
  const response = await apiClient.get(`/recommendations/result/${resultId}`);
  return response.data;
};

export const getAdminLogs = async (page = 1, limit = 100) => {
  const response = await apiClient.get("/admin/logs", {
    params: { page, limit },
  });
  return response.data;
};

export const getAdminResumes = async () => {
  const response = await apiClient.get("/admin/resumes");
  return response.data;
};

export const deleteResume = async (resumeId) => {
  const response = await apiClient.delete(`/resumes/${resumeId}`);
  return response.data;
};

import apiClient from '../apiClient';

export const getJobDescriptions = async (page = 1, limit = 100) => {
  const response = await apiClient.get('/jds', { params: { page, limit } });
  return response.data;
};

export const getJobDescription = async (jobDescriptionId) => {
  const response = await apiClient.get(`/jds/${jobDescriptionId}`);
  return response.data;
};

export const createJobDescription = async (jobDescription) => {
  const response = await apiClient.post('/jds', jobDescription);
  return response.data;
};

export const deleteJobDescription = async (jobDescriptionId) => {
  const response = await apiClient.delete(`/jds/${jobDescriptionId}`);
  return response.data;
};

import apiClient from '../apiClient';

export const getAnalysisResult = async (resumeId) => {
    const response = await apiClient.get(`/analysis/result/${resumeId}`);
    return response.data;
};

export default getAnalysisResult;

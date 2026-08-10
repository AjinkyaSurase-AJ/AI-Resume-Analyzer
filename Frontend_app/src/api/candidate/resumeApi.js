import apiClient from '../apiClient';

export const uploadResume = async (resumeFile, jobDescription = '') => {
    const formData = new FormData();

    formData.append("resume", {
        uri: resumeFile.uri,
        name: resumeFile.name,
        type: resumeFile.mimeType || 'application/octet-stream',
    });

    if (jobDescription.trim()) {
        formData.append('jd_text', jobDescription.trim());
    }

    const response = await apiClient.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
};

export const getResumes = async (page = 1, limit = 100) => {
    const response = await apiClient.get('/resumes', { params: { page, limit } });
    return response.data;
};

export const getResume = async (resumeId) => {
    const response = await apiClient.get(`/resumes/${resumeId}`);
    return response.data;
};

export const deleteResume = async (resumeId) => {
    const response = await apiClient.delete(`/resumes/${resumeId}`);
    return response.data;
};

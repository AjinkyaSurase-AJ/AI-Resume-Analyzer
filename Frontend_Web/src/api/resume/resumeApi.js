import api from '@/api/axios'

export const listResumes = ({ token, page, limit, admin = false } = {}) => api.get(admin ? '/api/admin/resumes' : '/api/resumes', { params: { page, limit }, token })
export const getResume = (resumeId, token) => api.get(`/api/resumes/${resumeId}`, { token })
export const deleteResume = (resumeId, token) => api.delete(`/api/resumes/${resumeId}`, { token })

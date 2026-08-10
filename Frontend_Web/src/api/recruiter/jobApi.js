import api from '@/api/axios'

export const listJobs = ({ token, page, limit, admin = false } = {}) => api.get(admin ? '/api/admin/jds' : '/api/jds', { params: { page, limit }, token })
export const getJob = (jobId, token) => api.get(`/api/jds/${jobId}`, { token })
export const createJob = (job, token) => api.post('/api/jds', job, { token })
export const deleteJob = (jobId, token) => api.delete(`/api/jds/${jobId}`, { token })

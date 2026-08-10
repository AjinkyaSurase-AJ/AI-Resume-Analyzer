import api from '@/api/axios'

export const getAdminDashboard = (token) => api.get('/api/admin/dashboard', { token })
export const listUsers = ({ token, page = 1, limit = 12, role } = {}) => api.get('/api/admin/users', { params: { page, limit, ...(role ? { role } : {}) }, token })
export const deleteUser = (userId, token) => api.delete(`/api/admin/users/${userId}`, { token })
export const listLogs = ({ token, page = 1, limit = 18 } = {}) => api.get('/api/admin/logs', { params: { page, limit }, token })

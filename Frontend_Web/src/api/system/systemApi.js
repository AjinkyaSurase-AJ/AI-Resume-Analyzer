import api from '@/api/axios'

export const checkHealth = () => api.get('/health')

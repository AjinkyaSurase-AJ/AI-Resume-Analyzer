import api from '@/api/axios'

export const listSkills = ({ token, page = 1, limit = 40 } = {}) => api.get('/api/skills', { params: { page, limit }, token })
export const createSkill = (skillName, token) => api.post('/api/skills', { skill_name: skillName }, { token })

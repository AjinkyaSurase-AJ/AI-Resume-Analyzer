import api from '@/api/axios'

export const signIn = (credentials) => api.post('/api/users/signin', credentials)
export const signUp = (account) => api.post('/api/users/signup', account)
export const updateProfile = (profile, token) => api.patch('/api/users/profile', profile, { token })

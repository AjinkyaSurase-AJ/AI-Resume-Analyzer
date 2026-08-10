import axios from 'axios'
import { environment } from '@/config/environment'
import { getStoredSession } from '@/utils/storage'

const api = axios.create({
  baseURL: environment.apiBaseUrl,
  timeout: environment.apiTimeoutMs,
})

api.interceptors.request.use((config) => {
  const token = config.token || getStoredSession()?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  delete config.token
  return config
})

api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => {
    const message = error.response?.data?.message
      || error.response?.data?.detail
      || (error.code === 'ECONNABORTED' ? 'The request timed out.' : null)
      || error.message
      || 'The request could not be completed.'
    return Promise.reject(new Error(message))
  },
)

export default api

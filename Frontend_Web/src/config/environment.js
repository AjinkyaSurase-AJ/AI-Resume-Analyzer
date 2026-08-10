export const environment = Object.freeze({
  apiBaseUrl: import.meta.env.VITE_API_URL,
  apiTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT || 30000),
})

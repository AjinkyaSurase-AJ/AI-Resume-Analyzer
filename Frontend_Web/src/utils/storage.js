import { STORAGE_KEYS } from '@/constants/storage'

export function getStoredSession() {
  try {
    const sessionStr = sessionStorage.getItem(STORAGE_KEYS.auth) || localStorage.getItem(STORAGE_KEYS.auth)
    return JSON.parse(sessionStr || 'null')
  } catch {
    return null
  }
}

export function storeSession(session, remember = true) {
  const sessionStr = JSON.stringify(session)
  if (remember) {
    localStorage.setItem(STORAGE_KEYS.auth, sessionStr)
    sessionStorage.removeItem(STORAGE_KEYS.auth)
    if (session?.user?.email) {
      localStorage.setItem(STORAGE_KEYS.rememberedEmail, session.user.email)
    }
  } else {
    sessionStorage.setItem(STORAGE_KEYS.auth, sessionStr)
    localStorage.removeItem(STORAGE_KEYS.auth)
    localStorage.removeItem(STORAGE_KEYS.rememberedEmail)
  }
}

export function clearStoredSession() {
  localStorage.removeItem(STORAGE_KEYS.auth)
  sessionStorage.removeItem(STORAGE_KEYS.auth)
}

export function getRememberedEmail() {
  try {
    return localStorage.getItem(STORAGE_KEYS.rememberedEmail) || ''
  } catch {
    return ''
  }
}

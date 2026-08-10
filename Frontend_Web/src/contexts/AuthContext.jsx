import React, { createContext, useCallback, useMemo, useState } from 'react'
import { clearStoredSession, getStoredSession, storeSession } from '@/utils/storage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredSession)

  const authenticate = useCallback((nextSession, remember = true) => {
    storeSession(nextSession, remember)
    setSession(nextSession)
  }, [])

  const logout = useCallback(() => {
    clearStoredSession()
    setSession(null)
  }, [])

  const updateUser = useCallback((user) => {
    setSession((current) => {
      const nextSession = { ...current, user }
      storeSession(nextSession)
      return nextSession
    })
  }, [])

  const value = useMemo(() => ({ session, authenticate, logout, updateUser }), [session, authenticate, logout, updateUser])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

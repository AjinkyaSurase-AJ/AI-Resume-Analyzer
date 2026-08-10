import React, { useState } from 'react'
import { Toast } from '@/components'
import { useAuth, useToast } from '@/hooks'
import { AppShell } from '@/layouts'
import { AuthPage } from '@/pages/Auth/AuthPage'
import { AppRoutes, ProtectedRoute } from '@/routes'

export default function App() {
  const { session, authenticate, logout, updateUser } = useAuth()
  const { toast, notify, clearToast } = useToast()
  const [current, setCurrent] = useState('overview')

  const onAuth = (nextSession, remember) => {
    authenticate(nextSession, remember)
    setCurrent('overview')
  }

  const onLogout = () => {
    logout()
    setCurrent('overview')
  }

  return (
    <ProtectedRoute
      isAllowed={Boolean(session?.token && session?.user)}
      fallback={<AuthPage onAuth={onAuth} />}
    >
      <AppShell session={session} current={current} setCurrent={setCurrent} onLogout={onLogout}>
        <AppRoutes
          current={current}
          token={session?.token}
          session={session}
          onSession={updateUser}
          notify={notify}
          onNavigate={setCurrent}
        />
      </AppShell>
      <Toast toast={toast} onClose={clearToast} />
    </ProtectedRoute>
  )
}

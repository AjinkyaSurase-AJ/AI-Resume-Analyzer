import React from 'react'
import { AdminWorkspace } from '@/pages/Admin'
import { CandidateWorkspace } from '@/pages/Candidate'
import { RecruiterWorkspace } from '@/pages/Recruiter'
import { RoleRoute } from './RoleRoute'

export function AppRoutes(props) {
  const role = props.session.user.role

  return (
    <>
      <RoleRoute role={role} allowedRoles={['admin']}>
        <AdminWorkspace {...props} />
      </RoleRoute>
      <RoleRoute role={role} allowedRoles={['recruiter']}>
        <RecruiterWorkspace {...props} />
      </RoleRoute>
      <RoleRoute role={role} allowedRoles={['candidate']}>
        <CandidateWorkspace {...props} />
      </RoleRoute>
    </>
  )
}

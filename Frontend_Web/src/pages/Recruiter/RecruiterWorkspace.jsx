import React from 'react'
import { ProfilePage, ResultsPage } from '@/pages/shared'
import { JobsPage } from './JobsPage'
import { RecruiterAnalyze, RecruiterOverview } from './RecruiterDashboard'
import { ResumesPage } from './ResumesPage'

export function RecruiterWorkspace({ current, token, session, onSession, notify, onNavigate }) {
  if (current === 'overview') return <RecruiterOverview token={token} onNavigate={onNavigate} />
  if (current === 'analyze') return <RecruiterAnalyze token={token} notify={notify} />
  if (current === 'jobs') return <JobsPage token={token} notify={notify} />
  if (current === 'resumes') return <ResumesPage token={token} notify={notify} />
  if (current === 'results') return <ResultsPage token={token} />
  return <ProfilePage token={token} user={session.user} onSession={onSession} notify={notify} />
}


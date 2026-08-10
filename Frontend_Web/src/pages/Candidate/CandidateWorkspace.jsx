import React, { useEffect, useState } from 'react'
import { analyzeCandidate, listResumes, listResults } from '@/api'
import { ActivityList, Badge, Button, FileDrop, Icon, OverviewHero, Panel, Score, Spinner, StatCard, Tags } from '@/components'
import { ResumesPage } from '@/pages/Recruiter/ResumesPage'
import { ProfilePage, ResultsPage } from '@/pages/shared'
import { pageRecords } from '@/utils'

export function CandidateOverview({ token, onNavigate }) {
  const [state, setState] = useState({ loading: true, resumes: [], results: [], error: '' })
  useEffect(() => {
    Promise.all([listResumes({ token, limit: 5 }), listResults({ token, limit: 5 })]).then(([resumes, results]) => setState({ loading: false, resumes: pageRecords(resumes), results: pageRecords(results), resumeTotal: resumes.pagination?.total || 0, resultTotal: results.pagination?.total || 0, error: '' })).catch((err) => setState((s) => ({ ...s, loading: false, error: err.message })))
  }, [token])
  const best = state.results.reduce((max, row) => Math.max(max, Number(row.ats_score || 0)), 0)
  return <><OverviewHero eyebrow="Candidate dashboard" title="Build a resume that gets noticed." text="Track your ATS performance, understand missing skills, and act on recommendations from every analysis." action={<Button icon="analyze" onClick={() => onNavigate('analyze')}>New analysis</Button>} />{state.error && <div className="inline-error"><Icon name="warning" />{state.error}</div>}<div className="stats-grid"><StatCard label="Resumes uploaded" value={state.resumeTotal} icon="resume" tone="blue" /><StatCard label="Analyses completed" value={state.resultTotal} icon="results" tone="purple" /><StatCard label="Best ATS score" value={best} icon="skills" tone="green" helper="Highest recorded match" /><StatCard label="Profile status" value={100} icon="profile" tone="orange" helper="Account active" /></div><div className="dashboard-grid"><Panel title="Recent analyses" subtitle="Your latest resume-to-job matches" actions={<Button variant="ghost" size="small" onClick={() => onNavigate('history')}>View all <Icon name="arrow" size={14} /></Button>}>{state.loading ? <Spinner /> : <ActivityList rows={state.results} />}</Panel><Panel title="Your next best move" subtitle="A focused workflow for stronger results"><div className="steps-list"><div><span>1</span><div><strong>Use the complete job description</strong><p>More context gives the analyzer a better skill baseline.</p></div></div><div><span>2</span><div><strong>Review missing skills</strong><p>Add only skills you genuinely have and can demonstrate.</p></div></div><div><span>3</span><div><strong>Run another analysis</strong><p>Compare the improved score before applying.</p></div></div></div></Panel></div></>
}

export function CandidateAnalyze({ token, notify }) {
  const [form, setForm] = useState({ jd: '', file: null })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const run = async (event) => {
    event.preventDefault()
    if (!form.file) return setError('Choose a resume file before starting the analysis.')
    const payload = new FormData()
    payload.append('resume', form.file)
    payload.append('jd_text', form.jd)
    setBusy(true); setError('')
    try {
      const data = await analyzeCandidate(payload, token)
      setResult(data)
      notify('Resume analysis completed successfully.')
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return <div className="form-layout"><Panel title="Analyze your resume" subtitle="Compare one resume against a target job description."><form className="stack-form" onSubmit={run}><label className="field"><span>Target job description</span><textarea required value={form.jd} onChange={(e) => setForm({ ...form, jd: e.target.value })} placeholder="Paste the full role description, including responsibilities and required skills…" /></label><div><span className="field-label">Resume document</span><FileDrop files={form.file} onChange={(file) => setForm({ ...form, file })} /></div>{error && <div className="inline-error"><Icon name="warning" />{error}</div>}<Button icon="analyze" disabled={busy}>{busy ? 'Analyzing resume…' : 'Run ATS analysis'}</Button></form></Panel><Panel title="How scoring works" subtitle="The backend remains the source of truth."><div className="formula-card"><span>ATS score</span><strong>Matched required skills</strong><i>÷</i><strong>Total required skills</strong><em>× 100</em></div><div className="score-legend"><div><i className="legend-excellent" /><span>80–100</span><strong>Excellent</strong></div><div><i className="legend-good" /><span>60–79</span><strong>Good</strong></div><div><i className="legend-average" /><span>40–59</span><strong>Average</strong></div><div><i className="legend-poor" /><span>Below 40</span><strong>Needs work</strong></div></div></Panel>{result && <section className="analysis-output"><div className="output-heading"><div><Badge tone="green">Analysis complete</Badge><h2>Your ATS match report</h2><p>{result.quality_label}</p></div><Score value={result.ats_score} /></div><div className="output-grid"><div className="insight-card"><span className="insight-icon success"><Icon name="check" /></span><h3>Matched skills</h3><Tags values={result.matched_skills || []} /></div><div className="insight-card"><span className="insight-icon warning"><Icon name="warning" /></span><h3>Skills to address</h3><Tags values={result.missing_skills || []} /></div></div><div className="recommendation-panel"><h3>Recommended improvements</h3><ul className="recommendation-list">{(result.recommendations || []).map((item, index) => <li key={index}><Icon name="arrow" size={16} /><span>{typeof item === 'string' ? item : item.recommendation_text || JSON.stringify(item)}</span></li>)}</ul></div></section>}</div>
}

export function CandidateWorkspace({ current, token, session, onSession, notify, onNavigate }) {
  if (current === 'overview') return <CandidateOverview token={token} onNavigate={onNavigate} />
  if (current === 'analyze') return <CandidateAnalyze token={token} notify={notify} />
  if (current === 'resumes') return <ResumesPage token={token} notify={notify} />
  if (current === 'history') return <ResultsPage token={token} title="Analysis history" subtitle="Open any result to review your score and recommendations." />
  return <ProfilePage token={token} user={session.user} onSession={onSession} notify={notify} />
}

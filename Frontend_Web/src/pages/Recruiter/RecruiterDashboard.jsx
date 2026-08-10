import React, { useEffect, useState } from 'react'
import { analyzeRecruiterBatch, listJobs, listResumes, listResults } from '@/api'
import { ActivityList, Button, EmptyState, FileDrop, Icon, OverviewHero, Panel, Score, Spinner, StatCard, Tags } from '@/components'
import { pageRecords } from '@/utils'

export function RecruiterOverview({ token, onNavigate }) {
  const [state, setState] = useState({ loading: true, jds: [], resumes: [], results: [], error: '' })
  useEffect(() => {
    Promise.all([listJobs({ token, limit: 5 }), listResumes({ token, limit: 5 }), listResults({ token, limit: 5 })]).then(([jds, resumes, results]) => setState({ loading: false, jds: pageRecords(jds), resumes: pageRecords(resumes), results: pageRecords(results), jdTotal: jds.pagination?.total || 0, resumeTotal: resumes.pagination?.total || 0, resultTotal: results.pagination?.total || 0, error: '' })).catch((err) => setState((s) => ({ ...s, loading: false, error: err.message })))
  }, [token])
  const average = state.results.length ? state.results.reduce((sum, row) => sum + Number(row.ats_score || 0), 0) / state.results.length : 0
  return <><OverviewHero eyebrow="Recruiter dashboard" title="Move from resumes to a confident shortlist." text="Create job criteria, analyze candidates in batches, and inspect every ranking from one workspace." action={<Button icon="analyze" onClick={() => onNavigate('analyze')}>Analyze candidates</Button>} />{state.error && <div className="inline-error"><Icon name="warning" />{state.error}</div>}<div className="stats-grid"><StatCard label="Active job descriptions" value={state.jdTotal} icon="jobs" tone="blue" /><StatCard label="Resumes processed" value={state.resumeTotal} icon="resume" tone="purple" /><StatCard label="Analysis results" value={state.resultTotal} icon="results" tone="green" /><StatCard label="Average ATS score" value={Math.round(average)} icon="activity" tone="orange" helper="Recent results" /></div><div className="dashboard-grid dashboard-grid-wide"><Panel title="Recent candidate analyses" subtitle="Latest resume evaluations" actions={<Button variant="ghost" size="small" onClick={() => onNavigate('results')}>View all <Icon name="arrow" size={14} /></Button>}>{state.loading ? <Spinner /> : <ActivityList rows={state.results} />}</Panel><Panel title="Open job descriptions" subtitle="Recently created hiring criteria">{state.loading ? <Spinner /> : state.jds.length ? <div className="compact-list">{state.jds.map((jd) => <button key={jd.jd_id} onClick={() => onNavigate('jobs')}><span className="table-icon"><Icon name="jobs" size={17} /></span><div><strong>{jd.title}</strong><small>{jd.experience_required ? `${jd.experience_required} years experience` : 'Experience flexible'}</small></div><Icon name="chevron" size={16} /></button>)}</div> : <EmptyState icon="jobs" title="No jobs created" text="Create a job description to start ranking candidates." />}</Panel></div></>
}

export function RecruiterAnalyze({ token, notify }) {
  const [form, setForm] = useState({ title: '', experience: '', jd: '', files: [] })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const run = async (event) => {
    event.preventDefault()
    if (!form.files.length || form.files.length > 5) return setError('Select between 1 and 5 PDF resumes.')
    const payload = new FormData()
    payload.append('jd_title', form.title)
    payload.append('experience_required', form.experience)
    payload.append('jd_text', form.jd)
    form.files.forEach((file) => payload.append('resumes', file))
    setBusy(true); setError('')
    try {
      const data = await analyzeRecruiterBatch(payload, token)
      setResult(data)
      notify(`${data.total_resumes || form.files.length} candidates analyzed and ranked.`)
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  const candidates = [...(result?.candidates || [])].sort((a, b) => Number(a.rank || 0) - Number(b.rank || 0))
  return <div className="form-layout"><Panel title="Analyze and rank candidates" subtitle="Upload up to five PDF resumes against one job description."><form className="stack-form" onSubmit={run}><div className="form-grid"><label className="field"><span>Job title</span><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Data Analyst" /></label><label className="field"><span>Experience required</span><input type="number" min="0" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 5" /></label></div><label className="field"><span>Job description</span><textarea required value={form.jd} onChange={(e) => setForm({ ...form, jd: e.target.value })} placeholder="Paste the complete job description and required skills…" /></label><div><span className="field-label">Candidate resumes</span><FileDrop multiple accept="application/pdf,.pdf" files={form.files} onChange={(files) => setForm({ ...form, files })} label="Upload candidate resumes" hint="PDF only · maximum 5 files" /></div>{error && <div className="inline-error"><Icon name="warning" />{error}</div>}<Button icon="analyze" disabled={busy}>{busy ? 'Analyzing and ranking…' : 'Analyze candidates'}</Button></form></Panel><Panel title="Batch analysis checklist" subtitle="For the most reliable ranking"><div className="check-list"><div><Icon name="check" /><span>Use the same role criteria for every candidate.</span></div><div><Icon name="check" /><span>Upload text-based PDFs for accurate parsing.</span></div><div><Icon name="check" /><span>Review score, skills, and summary together.</span></div><div><Icon name="check" /><span>Use ranking as decision support, not the only decision.</span></div></div></Panel>{result && <Panel className="full-span" title="Ranked candidate shortlist" subtitle={`Job #${result.jd_id} · ${candidates.length} candidate${candidates.length === 1 ? '' : 's'} analyzed`}><div className="ranking-list">{candidates.map((candidate, index) => <div className="candidate-card" key={candidate.result_id || index}><div className="rank-number">#{candidate.rank || index + 1}</div><div className="candidate-main"><div className="candidate-heading"><div><h3>{candidate.file_name || candidate.candidate_resume_name || `Candidate ${index + 1}`}</h3><p>{candidate.quality_label || candidate.recommendation_summary}</p></div><Score value={candidate.ats_score} /></div><div className="skill-columns"><div><span>Matched skills</span><Tags values={candidate.matched_skills || []} limit={8} /></div><div><span>Missing skills</span><Tags values={candidate.missing_skills || []} limit={8} /></div></div></div></div>)}</div></Panel>}</div>
}


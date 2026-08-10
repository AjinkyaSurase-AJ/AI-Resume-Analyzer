import React, { useEffect, useState } from 'react'
import { createJob, deleteJob, getJob, listJobs, rankCandidates } from '@/api'
import {
  Badge,
  Button,
  ConfirmDialog,
  DataToolbar,
  DetailGrid,
  EmptyState,
  FileDrop,
  Icon,
  Modal,
  Pagination,
  Panel,
  Score,
  Spinner,
  Tags,
} from '@/components'
import { formatDate, pageRecords, truncate } from '@/utils'

export function JobsPage({ token, notify, admin = false }) {
  const endpoint = admin ? '/api/admin/jds' : '/api/jds'
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [rankJob, setRankJob] = useState(null)
  const [selected, setSelected] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const load = () => { setData(null); listJobs({ token, page, limit: 12, admin }).then(setData).catch((err) => setError(err.message)) }
  useEffect(load, [endpoint, page, token])
  const rows = pageRecords(data).filter((row) => `${row.title} ${row.description}`.toLowerCase().includes(search.toLowerCase()))
  const remove = async () => {
    setBusy(true)
    try { await deleteJob(confirm.jd_id, token); notify('Job description deleted.'); setConfirm(null); load() } catch (err) { notify(err.message, 'error') } finally { setBusy(false) }
  }
  return <Panel title={admin ? 'Job description repository' : 'Job descriptions'} subtitle={admin ? 'Review and govern every job description stored in the platform.' : 'Create hiring criteria and run candidate rankings for any job.'} actions={!admin && <Button icon="plus" onClick={() => setCreateOpen(true)}>Create job</Button>}><DataToolbar search={search} onSearch={setSearch} placeholder="Search job descriptions…" />{error ? <div className="inline-error"><Icon name="warning" />{error}</div> : !data ? <Spinner /> : rows.length ? <div className="table-wrap"><table><thead><tr><th>Job title</th><th>Recruiter</th><th>Experience</th><th>Created</th><th className="actions-column">Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.jd_id}><td><div className="primary-cell"><span className="table-icon"><Icon name="jobs" size={17} /></span><div><strong>{row.title}</strong><span>{truncate(row.description, 65)}</span></div></div></td><td>User #{row.recruiter_id}</td><td>{row.experience_required ? `${row.experience_required} years` : 'Not specified'}</td><td>{formatDate(row.upload_date)}</td><td><div className="row-actions"><button className="row-action" onClick={() => setSelected(row)} title="View"><Icon name="eye" size={17} /></button>{!admin && <button className="row-action row-action-primary" onClick={() => setRankJob(row)} title="Rank candidates"><Icon name="analyze" size={17} /></button>}<button className="row-action row-action-danger" onClick={() => setConfirm(row)} title="Delete"><Icon name="trash" size={17} /></button></div></td></tr>)}</tbody></table></div> : <EmptyState icon="jobs" title="No job descriptions found" text={admin ? 'Job descriptions created by recruiters will appear here.' : 'Create your first job description to begin candidate ranking.'} action={!admin && <Button icon="plus" onClick={() => setCreateOpen(true)}>Create job</Button>} />}<Pagination pagination={data?.pagination} onPage={setPage} />{createOpen && <CreateJobModal token={token} notify={notify} onClose={() => setCreateOpen(false)} onCreated={() => { setCreateOpen(false); load() }} />}{rankJob && <RankJobModal job={rankJob} token={token} notify={notify} onClose={() => setRankJob(null)} />}{selected && <JobDetailModal job={selected} token={token} onClose={() => setSelected(null)} />}{confirm && <ConfirmDialog title="Delete job description?" message={`“${confirm.title}” and its related database records may be removed. This action cannot be undone.`} busy={busy} onClose={() => setConfirm(null)} onConfirm={remove} />}</Panel>
}

function CreateJobModal({ token, notify, onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', experience_required: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('')
    try { await createJob(form, token); notify('Job description created successfully.'); onCreated() } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return <Modal title="Create job description" subtitle="Define the role criteria used for skill extraction and ranking." onClose={onClose}><form className="stack-form" onSubmit={submit}><label className="field"><span>Job title</span><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Power BI Developer" /></label><label className="field"><span>Experience required</span><input type="number" min="0" value={form.experience_required} onChange={(e) => setForm({ ...form, experience_required: e.target.value })} placeholder="Years" /></label><label className="field"><span>Full description</span><textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Responsibilities, required skills, qualifications…" /></label>{error && <div className="inline-error"><Icon name="warning" />{error}</div>}<div className="modal-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button icon="plus" disabled={busy}>{busy ? 'Creating…' : 'Create job'}</Button></div></form></Modal>
}

function RankJobModal({ job, token, notify, onClose }) {
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])
  const run = async (event) => {
    event.preventDefault()
    if (!files.length) return setError('Select at least one PDF resume.')
    const form = new FormData(); files.forEach((file) => form.append('resumes', file))
    setBusy(true); setError('')
    try { const data = await rankCandidates(job.jd_id, form, token); const records = pageRecords(data).sort((a, b) => Number(a.rank || 0) - Number(b.rank || 0)); setResults(records); notify('Candidate ranking completed.') } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return <Modal title={`Rank candidates for ${job.title}`} subtitle={`Job description #${job.jd_id} · Upload one or more PDF resumes`} onClose={onClose} size="large"><form className="stack-form" onSubmit={run}><FileDrop multiple accept="application/pdf,.pdf" files={files} onChange={setFiles} label="Upload resumes for ranking" hint="PDF only · up to 20 files supported by the endpoint" />{error && <div className="inline-error"><Icon name="warning" />{error}</div>}<Button icon="analyze" disabled={busy}>{busy ? 'Running ranking…' : 'Run candidate ranking'}</Button></form>{results.length > 0 && <div className="ranking-list modal-ranking">{results.map((candidate, index) => <div className="candidate-card" key={candidate.result_id || index}><div className="rank-number">#{candidate.rank || index + 1}</div><div className="candidate-main"><div className="candidate-heading"><div><h3>{candidate.candidate_resume_name || candidate.original_name || `Candidate ${index + 1}`}</h3><p>{candidate.quality_label || candidate.recommendation_summary}</p></div><Score value={candidate.ats_score} /></div><Tags values={candidate.matched_skills || []} limit={7} /></div></div>)}</div>}</Modal>
}

function JobDetailModal({ job, token, onClose }) {
  const [details, setDetails] = useState(null)
  useEffect(() => { getJob(job.jd_id, token).then(setDetails).catch(() => setDetails(job)) }, [job, token])
  return <Modal title={job.title} subtitle={`Job description #${job.jd_id}`} onClose={onClose} size="large">{!details ? <Spinner /> : <div><DetailGrid items={[{ label: 'Recruiter ID', value: details.recruiter_id }, { label: 'Experience', value: details.experience_required ? `${details.experience_required} years` : 'Not specified' }, { label: 'Created', value: formatDate(details.upload_date) }]} /><div className="narrative"><h4>Job description</h4><p className="preserve-text">{details.description}</p></div><div className="narrative"><h4>Extracted required skills</h4><Tags values={details.skills || []} /></div></div>}</Modal>
}


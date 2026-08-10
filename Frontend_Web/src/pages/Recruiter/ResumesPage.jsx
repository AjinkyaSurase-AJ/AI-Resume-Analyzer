import React, { useEffect, useState } from 'react'
import { deleteResume, getResume, listResumes } from '@/api'
import {
  Badge,
  ConfirmDialog,
  DataToolbar,
  DetailGrid,
  EmptyState,
  Icon,
  Modal,
  Pagination,
  Panel,
  Spinner,
  Tags,
} from '@/components'
import { formatDate, pageRecords } from '@/utils'

export function ResumesPage({ token, notify, admin = false }) {
  const endpoint = admin ? '/api/admin/resumes' : '/api/resumes'
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const load = () => { setData(null); listResumes({ token, page, limit: 12, admin }).then(setData).catch((err) => setError(err.message)) }
  useEffect(load, [endpoint, page, token])
  const rows = pageRecords(data).filter((row) => `${row.original_name} ${row.file_name}`.toLowerCase().includes(search.toLowerCase()))
  const remove = async () => { setBusy(true); try { await deleteResume(confirm.resume_id, token); notify('Resume deleted successfully.'); setConfirm(null); load() } catch (err) { notify(err.message, 'error') } finally { setBusy(false) } }
  return <Panel title={admin ? 'Resume repository' : 'Resume library'} subtitle={admin ? 'Inspect all uploaded candidate documents across the system.' : 'Review the resumes uploaded through your recruiter analyses.'}><DataToolbar search={search} onSearch={setSearch} placeholder="Search resume files…" />{error ? <div className="inline-error"><Icon name="warning" />{error}</div> : !data ? <Spinner /> : rows.length ? <div className="table-wrap"><table><thead><tr><th>Resume</th><th>Candidate</th><th>Uploaded by</th><th>Uploaded</th><th className="actions-column">Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.resume_id}><td><div className="primary-cell"><span className="table-icon"><Icon name="resume" size={17} /></span><div><strong>{row.original_name || row.file_name}</strong><span>Resume #{row.resume_id}</span></div></div></td><td>{row.candidate_id ? `User #${row.candidate_id}` : <Badge tone="neutral">Recruiter upload</Badge>}</td><td>User #{row.uploaded_by}</td><td>{formatDate(row.upload_date)}</td><td><div className="row-actions"><button className="row-action" onClick={() => setSelected(row)}><Icon name="eye" size={17} /></button><button className="row-action row-action-danger" onClick={() => setConfirm(row)}><Icon name="trash" size={17} /></button></div></td></tr>)}</tbody></table></div> : <EmptyState icon="resume" title="No resumes found" text="Uploaded resumes will appear in this repository." />}<Pagination pagination={data?.pagination} onPage={setPage} />{selected && <ResumeDetailModal resume={selected} token={token} onClose={() => setSelected(null)} />}{confirm && <ConfirmDialog title="Delete resume?" message={`“${confirm.original_name || confirm.file_name}” will be permanently removed along with dependent records.`} busy={busy} onClose={() => setConfirm(null)} onConfirm={remove} />}</Panel>
}

function ResumeDetailModal({ resume, token, onClose }) {
  const [details, setDetails] = useState(null)
  useEffect(() => { getResume(resume.resume_id, token).then(setDetails).catch(() => setDetails(resume)) }, [resume, token])
  return <Modal title={resume.original_name || resume.file_name} subtitle={`Resume #${resume.resume_id}`} onClose={onClose} size="large">{!details ? <Spinner /> : <div><DetailGrid items={[{ label: 'Candidate ID', value: details.candidate_id || 'Recruiter upload' }, { label: 'Uploaded by', value: `User #${details.uploaded_by}` }, { label: 'Stored file', value: details.file_name }, { label: 'Upload date', value: formatDate(details.upload_date) }]} /><div className="narrative"><h4>Detected skills</h4><Tags values={details.skills || []} /></div>{details.extracted_text && <div className="narrative"><h4>Extracted resume text</h4><p className="preserve-text text-preview">{details.extracted_text}</p></div>}</div>}</Modal>
}


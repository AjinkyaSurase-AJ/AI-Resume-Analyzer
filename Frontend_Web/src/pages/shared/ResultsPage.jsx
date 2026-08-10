import React, { useEffect, useState } from 'react'
import { listResultsFrom } from '@/api'
import { Badge, DataToolbar, EmptyState, Icon, Modal, Pagination, Panel, ResultDetail, Score, Spinner } from '@/components'
import { formatDate, pageRecords } from '@/utils'

export function ResultsPage({ token, endpoint = '/api/results', title = 'Analysis results', subtitle = 'Review ATS scores and generated recommendations.' }) {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    setData(null); setError('')
    listResultsFrom(endpoint, { token, page, limit: 12 }).then(setData).catch((err) => setError(err.message))
  }, [token, endpoint, page])
  const rows = pageRecords(data)
    .filter((row) => `${row.original_name || ''} ${row.title || ''} ${row.quality_label || ''}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.ranking && b.ranking) return Number(a.ranking) - Number(b.ranking)
      if (a.ranking) return -1
      if (b.ranking) return 1
      return Number(b.ats_score || 0) - Number(a.ats_score || 0)
    })
  return <Panel title={title} subtitle={subtitle}><DataToolbar search={search} onSearch={setSearch} placeholder="Search by resume, job, or quality…" />{error ? <div className="inline-error"><Icon name="warning" />{error}</div> : !data ? <Spinner /> : rows.length ? <div className="table-wrap"><table><thead><tr><th>Resume</th><th>Job description</th><th>ATS score</th><th>Quality</th><th>Ranking</th><th>Date</th><th /></tr></thead><tbody>{rows.map((row) => <tr key={row.result_id}><td><div className="primary-cell"><span className="table-icon"><Icon name="resume" size={17} /></span><div><strong>{row.original_name || `Resume #${row.resume_id}`}</strong><span>Result #{row.result_id}</span></div></div></td><td><strong>{row.title || `Job #${row.jd_id}`}</strong></td><td><Score value={row.ats_score} compact /></td><td><Badge tone={Number(row.ats_score) >= 80 ? 'green' : Number(row.ats_score) >= 60 ? 'blue' : Number(row.ats_score) >= 40 ? 'orange' : 'red'}>{row.quality_label || 'Analyzed'}</Badge></td><td>{row.ranking ? `#${row.ranking}` : '—'}</td><td>{formatDate(row.created_at)}</td><td><button className="row-action" onClick={() => setSelected(row)} title="View result"><Icon name="eye" size={17} /></button></td></tr>)}</tbody></table></div> : <EmptyState icon="results" title="No analysis results found" text="Run a resume analysis to create the first result." />}<Pagination pagination={data?.pagination} onPage={setPage} />{selected && <Modal title="Analysis details" subtitle="Score, ranking, summary, and recommendations" onClose={() => setSelected(null)} size="large"><ResultDetail result={selected} token={token} /></Modal>}</Panel>
}


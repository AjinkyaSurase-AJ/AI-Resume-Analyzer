import React, { useEffect, useState } from 'react'
import { listLogs } from '@/api'
import { Badge, DataToolbar, EmptyState, Icon, Pagination, Panel, Spinner } from '@/components'
import { formatDate, pageRecords, titleCase } from '@/utils'

export function LogsPage({ token }) {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  useEffect(() => { setData(null); listLogs({ token, page, limit: 18 }).then(setData).catch((err) => setError(err.message)) }, [token, page])
  const rows = pageRecords(data).filter((row) => `${row.event} ${row.description} ${row.ip_address}`.toLowerCase().includes(search.toLowerCase()))
  return <Panel title="Audit logs" subtitle="A chronological record of authentication, analysis, and administrative events."><DataToolbar search={search} onSearch={setSearch} placeholder="Search events, descriptions, or IP…" />{error ? <div className="inline-error"><Icon name="warning" />{error}</div> : !data ? <Spinner /> : rows.length ? <div className="timeline">{rows.map((row) => <div className="timeline-row" key={row.log_id}><div className="timeline-line"><span><Icon name="logs" size={15} /></span></div><div className="timeline-content"><div><Badge tone="blue">{titleCase(row.event)}</Badge><strong>Event #{row.log_id}</strong></div><p>{row.description || 'No additional description.'}</p><footer><span>User {row.user_id ? `#${row.user_id}` : 'system'}</span><span>IP {row.ip_address || 'unknown'}</span><time>{formatDate(row.created_at)}</time></footer></div></div>)}</div> : <EmptyState icon="logs" title="No audit events found" text="System activity will appear here as users interact with the application." />}<Pagination pagination={data?.pagination} onPage={setPage} /></Panel>
}


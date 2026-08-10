import React from 'react'
import { Button, EmptyState, Icon, Score } from '@/components/common'
import { formatDate, titleCase, truncate } from '@/utils'

export function OverviewHero({ eyebrow, title, text, action }) {
  return <section className="overview-hero"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{text}</p></div>{action}</section>
}

export function ActivityList({ rows = [], type = 'result' }) {
  if (!rows.length) return <EmptyState icon="activity" title="No recent activity" text="Activity will appear after the first analysis." />
  return <div className="activity-list">{rows.map((row, index) => <div className="activity-row" key={row.result_id || row.log_id || row.resume_id || index}><span className={`activity-icon activity-${type}`}><Icon name={type === 'log' ? 'logs' : type === 'resume' ? 'resume' : 'results'} size={17} /></span><div><strong>{type === 'log' ? titleCase(row.event) : row.original_name || row.file_name || row.title || `Analysis #${row.result_id}`}</strong><p>{type === 'log' ? truncate(row.description, 80) : row.quality_label || row.title || 'Resume processed successfully'}</p></div><div className="activity-meta">{row.ats_score !== undefined && <Score value={row.ats_score} compact />}<span>{formatDate(row.created_at || row.upload_date)}</span></div></div>)}</div>
}


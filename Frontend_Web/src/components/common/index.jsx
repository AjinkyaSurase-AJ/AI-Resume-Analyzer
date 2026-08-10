import React, { useEffect, useState } from 'react'
import { Icon } from './Icon'
import { cx, titleCase } from '@/utils'

export function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

export function RoleBadge({ role }) {
  const tones = { admin: 'purple', recruiter: 'blue', candidate: 'green' }
  return <Badge tone={tones[role] || 'neutral'}>{titleCase(role || 'unknown')}</Badge>
}

export function Score({ value, compact = false }) {
  const number = Math.max(0, Math.min(100, Number(value || 0)))
  const tone = number >= 80 ? 'excellent' : number >= 60 ? 'good' : number >= 40 ? 'average' : 'poor'
  return <div className={cx('score-pill', `score-${tone}`, compact && 'score-compact')}><span>{Math.round(number)}</span><small>%</small></div>
}

export function Tags({ values = [], limit }) {
  const normalized = values.map((value) => typeof value === 'string' ? value : value.skill_name).filter(Boolean)
  const visible = limit ? normalized.slice(0, limit) : normalized
  return <div className="tags">{visible.length ? visible.map((value) => <span key={value}>{value}</span>) : <span className="tag-empty">None detected</span>}{limit && normalized.length > limit && <span className="tag-more">+{normalized.length - limit}</span>}</div>
}

export function Button({ children, icon, variant = 'primary', size = 'medium', className = '', ...props }) {
  return <button className={cx('button', `button-${variant}`, `button-${size}`, className)} {...props}>{icon && <Icon name={icon} size={size === 'small' ? 15 : 17} />}{children}</button>
}

export function EmptyState({ icon = 'file', title = 'Nothing here yet', text = 'New records will appear here.', action }) {
  return <div className="empty-state"><div className="empty-icon"><Icon name={icon} size={26} /></div><h3>{title}</h3><p>{text}</p>{action}</div>
}

export function Spinner({ label = 'Loading data…' }) {
  return <div className="loading-state"><span className="spinner" /><p>{label}</p></div>
}

export function Panel({ title, subtitle, actions, children, className = '' }) {
  return <section className={cx('panel', className)}><div className="panel-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{actions && <div className="panel-actions">{actions}</div>}</div>{children}</section>
}

export function StatCard({ label, value, icon, tone = 'blue', helper }) {
  return <div className="stat-card"><div className={`stat-icon stat-${tone}`}><Icon name={icon} size={20} /></div><div><span>{label}</span><strong>{Number(value || 0).toLocaleString()}</strong>{helper && <small>{helper}</small>}</div></div>
}

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [toast, onClose])
  if (!toast) return null
  return <div className={cx('toast', `toast-${toast.type || 'success'}`)}><Icon name={toast.type === 'error' ? 'warning' : 'check'} /><div><strong>{toast.title || (toast.type === 'error' ? 'Something went wrong' : 'Completed')}</strong><p>{toast.message}</p></div><button onClick={onClose} aria-label="Close notification"><Icon name="close" size={16} /></button></div>
}

export function Modal({ title, subtitle, onClose, children, size = 'medium' }) {
  useEffect(() => {
    const close = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [onClose])
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className={cx('modal', `modal-${size}`)}><div className="modal-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button></div><div className="modal-body">{children}</div></div></div>
}

export function ConfirmDialog({ title, message, confirmLabel = 'Delete', busy, onConfirm, onClose }) {
  return <Modal title={title} onClose={onClose} size="small"><div className="confirm-content"><div className="confirm-icon"><Icon name="warning" size={28} /></div><p>{message}</p><div className="modal-actions"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="danger" icon="trash" disabled={busy} onClick={onConfirm}>{busy ? 'Deleting…' : confirmLabel}</Button></div></div></Modal>
}

export function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.totalPages <= 1) return null
  return <div className="pagination"><span>Page {pagination.page} of {pagination.totalPages} · {pagination.total} records</span><div><Button variant="secondary" size="small" disabled={pagination.page <= 1} onClick={() => onPage(pagination.page - 1)}>Previous</Button><Button variant="secondary" size="small" disabled={pagination.page >= pagination.totalPages} onClick={() => onPage(pagination.page + 1)}>Next</Button></div></div>
}

export function DataToolbar({ search, onSearch, placeholder = 'Search records…', children }) {
  return <div className="data-toolbar"><label className="search-box"><Icon name="search" size={17} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder={placeholder} /></label>{children && <div className="toolbar-actions">{children}</div>}</div>
}

export function FileDrop({ multiple = false, accept = '.pdf,.doc,.docx', files = [], onChange, label = 'Upload resume', hint = 'PDF, DOC, or DOCX' }) {
  const [drag, setDrag] = useState(false)
  const selected = multiple ? files : (files ? [files] : [])
  const handle = (list) => onChange(multiple ? [...list] : list[0])
  return <label className={cx('file-drop', drag && 'dragging')} onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files) }}><input type="file" accept={accept} multiple={multiple} onChange={(e) => handle(e.target.files)} /><div className="file-drop-icon"><Icon name="upload" size={23} /></div><div><strong>{selected.length ? `${selected.length} file${selected.length > 1 ? 's' : ''} selected` : label}</strong><span>{selected.length ? selected.map((f) => f?.name).filter(Boolean).join(', ') : `Drag and drop or click to browse · ${hint}`}</span></div></label>
}

export function DetailGrid({ items }) {
  return <div className="detail-grid">{items.map(({ label, value, wide }) => <div className={wide ? 'detail-wide' : ''} key={label}><span>{label}</span><strong>{value ?? '—'}</strong></div>)}</div>
}


export { Icon } from './Icon'


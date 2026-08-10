import React, { useEffect, useState } from 'react'
import { deleteUser, listUsers } from '@/api'
import { Badge, ConfirmDialog, DataToolbar, EmptyState, Icon, Pagination, Panel, RoleBadge, Spinner } from '@/components'
import { formatDate, initials, pageRecords } from '@/utils'

export function UsersPage({ token, currentUser, notify }) {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')
  const [confirm, setConfirm] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const load = () => { setData(null); setError(''); listUsers({ token, page, limit: 12, role }).then(setData).catch((err) => setError(err.message)) }
  useEffect(load, [token, page, role])
  const rows = pageRecords(data).filter((row) => `${row.name} ${row.email}`.toLowerCase().includes(search.toLowerCase()))
  const remove = async () => { setBusy(true); try { await deleteUser(confirm.user_id, token); notify('User account deleted successfully.'); setConfirm(null); load() } catch (err) { notify(err.message, 'error') } finally { setBusy(false) } }
  return <Panel title="User management" subtitle="Search, filter, and administer candidate and recruiter accounts."><DataToolbar search={search} onSearch={setSearch} placeholder="Search name or email…"><label className="select-filter"><Icon name="filter" size={16} /><select value={role} onChange={(e) => { setRole(e.target.value); setPage(1) }}><option value="">All roles</option><option value="candidate">Candidates</option><option value="recruiter">Recruiters</option><option value="admin">Administrators</option></select></label></DataToolbar>{error ? <div className="inline-error"><Icon name="warning" />{error}</div> : !data ? <Spinner /> : rows.length ? <div className="table-wrap"><table><thead><tr><th>User</th><th>Role</th><th>Account ID</th><th>Joined</th><th className="actions-column">Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.user_id}><td><div className="user-cell"><span className="avatar avatar-small">{initials(row.name)}</span><div><strong>{row.name}</strong><span>{row.email}</span></div></div></td><td><RoleBadge role={row.role} /></td><td>#{row.user_id}</td><td>{formatDate(row.created_at)}</td><td>{row.user_id === currentUser.user_id ? <Badge tone="neutral">Current account</Badge> : <button className="row-action row-action-danger" onClick={() => setConfirm(row)} title="Delete user"><Icon name="trash" size={17} /></button>}</td></tr>)}</tbody></table></div> : <EmptyState icon="users" title="No users match this view" text="Try another search term or role filter." />}<Pagination pagination={data?.pagination} onPage={setPage} />{confirm && <ConfirmDialog title="Delete user account?" message={`${confirm.name} (${confirm.email}) will be removed from the platform. Related records may also be affected.`} busy={busy} onClose={() => setConfirm(null)} onConfirm={remove} />}</Panel>
}


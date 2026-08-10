import React, { useEffect, useState } from 'react'
import { createSkill, listSkills } from '@/api'
import { Button, DataToolbar, EmptyState, Icon, Pagination, Panel, Spinner } from '@/components'
import { pageRecords } from '@/utils'

export function SkillsPage({ token, notify }) {
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [skill, setSkill] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const load = () => { setData(null); listSkills({ token, page, limit: 40 }).then(setData).catch((err) => setError(err.message)) }
  useEffect(load, [token, page])
  const rows = pageRecords(data).filter((row) => row.skill_name.toLowerCase().includes(search.toLowerCase()))
  const add = async (event) => { event.preventDefault(); if (!skill.trim()) return; setBusy(true); setError(''); try { await createSkill(skill.trim(), token); notify(`“${skill.trim()}” added to the skills library.`); setSkill(''); load() } catch (err) { setError(err.message) } finally { setBusy(false) } }
  return <div className="skills-layout"><Panel title="Skills library" subtitle="Canonical skills used by extraction, matching, and recommendations."><DataToolbar search={search} onSearch={setSearch} placeholder="Search skills…" />{!data ? <Spinner /> : rows.length ? <div className="skill-cloud">{rows.map((row) => <div key={row.skill_id}><span>{row.skill_name}</span><small>#{row.skill_id}</small></div>)}</div> : <EmptyState icon="skills" title="No skills found" text="Add a new skill or change your search." />}<Pagination pagination={data?.pagination} onPage={setPage} /></Panel><Panel title="Add a skill" subtitle="New entries are normalized and deduplicated by the backend."><form className="stack-form" onSubmit={add}><label className="field"><span>Skill name</span><input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="e.g. power bi" /></label>{error && <div className="inline-error"><Icon name="warning" />{error}</div>}<Button icon="plus" disabled={busy || !skill.trim()}>{busy ? 'Saving…' : 'Add to library'}</Button></form><div className="info-callout"><Icon name="skills" /><p>Skills are stored in lowercase and reused across resumes, job descriptions, matched skills, and missing skills.</p></div></Panel></div>
}


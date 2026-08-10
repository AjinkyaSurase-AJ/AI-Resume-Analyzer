import React, { useState } from 'react'
import { signIn, signUp } from '@/api'
import { Badge, Button, Icon } from '@/components'
import { getRememberedEmail } from '@/utils/storage'

export function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('signin')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [form, setForm] = useState({ name: '', email: getRememberedEmail(), password: '', role: 'candidate' })
  const register = mode === 'signup'

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const data = await (register ? signUp(form) : signIn(form))
      onAuth(data, remember)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return <main className="auth-page"><section className="auth-showcase"><div className="auth-brand"><span className="brand-mark"><Icon name="analyze" size={22} /></span><span>AI Resume Analyzer</span></div><div className="showcase-copy"><Badge tone="light">AI-powered talent intelligence</Badge><h1>Make every resume decision <em>clearer.</em></h1><p>Analyze candidate fit, uncover skill gaps, and rank talent through one secure, role-based workspace.</p><div className="proof-grid"><div><strong>Transparent</strong><span>Rule-based ATS scoring</span></div><div><strong>Efficient</strong><span>Batch candidate ranking</span></div><div><strong>Actionable</strong><span>Skill recommendations</span></div></div></div><div className="showcase-preview"><div className="preview-head"><span>Candidate match overview</span><Badge tone="green">Live analysis</Badge></div><div className="preview-score"><div className="preview-ring"><strong>86</strong><span>ATS score</span></div><div><h3>Strong candidate fit</h3><p>12 of 14 required skills matched</p><div className="mini-bars"><i style={{ width: '86%' }} /><i style={{ width: '72%' }} /><i style={{ width: '94%' }} /></div></div></div></div></section><section className="auth-form-wrap"><form className="auth-card" onSubmit={submit}><div className="mobile-brand"><span className="brand-mark"><Icon name="analyze" size={20} /></span><span>AI Resume Analyzer</span></div><div className="auth-heading"><h2>{register ? 'Create your account' : 'Welcome back'}</h2><p>{register ? 'Choose your workspace and start analyzing talent.' : 'Sign in to continue to your workspace.'}</p></div>{register && <label className="field"><span>Full name</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Alex Morgan" /></label>}<label className="field"><span>Email address</span><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@company.com" /></label><label className="field"><span>Password</span><div className="password-input-wrap"><input required minLength={6} type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" /><button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)} title={showPassword ? 'Hide password' : 'Show password'}><Icon name={showPassword ? 'eyeOff' : 'eye'} size={17} /></button></div></label>{register && <label className="field"><span>Workspace type</span><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="candidate">Candidate — analyze my resume</option><option value="recruiter">Recruiter — compare candidates</option></select></label>}{!register && <div className="auth-options"><label className="remember-option"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span>Remember me</span></label></div>}{error && <div className="inline-error"><Icon name="warning" size={17} />{error}</div>}<Button className="auth-submit" disabled={busy}>{busy ? 'Please wait…' : register ? 'Create account' : 'Sign in'}<Icon name="arrow" size={17} /></Button><div className="auth-switch"><span>{register ? 'Already have an account?' : 'New to AI Resume Analyzer?'}</span><button type="button" onClick={() => { setMode(register ? 'signin' : 'signup'); setError('') }}>{register ? 'Sign in' : 'Create an account'}</button></div></form><p className="auth-footer">Secure role-based access · Powered by your AI Resume Analyzer backend</p></section></main>
}



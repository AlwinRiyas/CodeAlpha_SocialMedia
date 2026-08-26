import { useState } from 'react'
import { api } from '../lib/api.js'

export function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', username: '', displayName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }) }

  async function submit(event) {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form
      const data = await api(path, { method: 'POST', body: JSON.stringify(payload) })
      localStorage.setItem('token', data.token)
      onAuthenticated(data.user)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return <main className="auth-shell"><form className="auth-card" onSubmit={submit}>
    <div className="brand">Connect<span>.</span></div><h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
    {mode === 'register' && <><input name="displayName" placeholder="Display name" value={form.displayName} onChange={update} required /><input name="username" placeholder="Username" value={form.username} onChange={update} required /></>}
    <input name="email" type="email" placeholder="Email" value={form.email} onChange={update} required />
    <input name="password" type="password" placeholder="Password" value={form.password} onChange={update} required />
    {error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}</button>
    <p><button type="button" className="text-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}</button></p>
  </form></main>
}

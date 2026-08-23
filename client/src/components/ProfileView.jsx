import { useState } from 'react'
import { api } from '../lib/api.js'

export function ProfileView({ user, onBack, onUpdated }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ displayName: user.displayName || '', bio: user.bio || '', avatarUrl: user.avatarUrl || '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function save(event) {
    event.preventDefault(); setSaving(true); setError('')
    try {
      const updated = await api('/users/me', { method: 'PATCH', body: JSON.stringify(form) })
      onUpdated(updated); setEditing(false)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const avatar = user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : user.displayName?.[0] ?? '?'

  return <main className="profile-view">
    <button className="text-button" onClick={onBack}>← Back to feed</button>
    <section className="profile-card">
      <div className="profile-avatar">{avatar}</div>
      <div><p className="eyebrow">Profile</p><h1>{user.displayName}</h1><p className="profile-handle">@{user.username}</p></div>
      <p className="profile-bio">{user.bio || 'No bio added yet.'}</p>
      <div className="profile-stats"><span><strong>{user._count?.posts ?? 0}</strong> Posts</span><span><strong>{user._count?.followers ?? 0}</strong> Followers</span><span><strong>{user._count?.following ?? 0}</strong> Following</span></div>
      <button className="primary-button" onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : 'Edit profile'}</button>
    </section>
    {editing && <form className="profile-editor" onSubmit={save}>
      <input value={form.displayName} maxLength="80" onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="Display name" required />
      <textarea value={form.bio} maxLength="500" onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio" />
      <input value={form.avatarUrl} maxLength="2048" onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} placeholder="Avatar image URL (optional)" />
      {error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
    </form>}
  </main>
}

import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

export function PublicProfileView({ username, onBack }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [connection, setConnection] = useState('LOADING')

  useEffect(() => {
    setLoading(true); setError('')
    Promise.all([api(`/users/${username}`)]).then(([data]) => setProfile(data)).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }, [username])

  useEffect(() => {
    if (!profile) return
    api(`/connections/state/${profile.id}`).then((data) => setConnection(data.status)).catch(() => setConnection('NONE'))
  }, [profile])

  async function connect() {
    try { await api(`/connections/${profile.id}`, { method: 'POST' }); setConnection('PENDING_SENT') } catch (err) { setError(err.message) }
  }

  if (loading) return <main className="profile-view"><p>Loading profile…</p></main>
  if (error && !profile) return <main className="profile-view"><button className="text-button" onClick={onBack}>← Back</button><p className="form-error">{error}</p></main>
  if (!profile) return null

  const actionLabel = { LOADING: 'Checking…', PENDING_SENT: 'Requested', PENDING_RECEIVED: 'Respond in Discover', CONNECTED: 'Connected', NONE: 'Connect' }[connection]

  return <main className="profile-view">
    <button className="text-button" onClick={onBack}>← Back to feed</button>
    <section className="profile-card">
      <div className="profile-avatar">{profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : profile.displayName?.[0] ?? '?'}</div>
      <div><p className="eyebrow">Member</p><h1>{profile.displayName}</h1><p className="profile-handle">@{profile.username}</p></div>
      <p className="profile-bio">{profile.bio || 'No bio added yet.'}</p>
      <div className="profile-stats"><span><strong>{profile._count?.posts ?? 0}</strong> Posts</span><span><strong>{profile._count?.followers ?? 0}</strong> Followers</span><span><strong>{profile._count?.following ?? 0}</strong> Following</span></div>
      <button className="primary-button" disabled={connection !== 'NONE'} onClick={connect}>{actionLabel}</button>
      {error && <p className="form-error">{error}</p>}
    </section>
  </main>
}

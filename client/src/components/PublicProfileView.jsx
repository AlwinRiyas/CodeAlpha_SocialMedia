import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

export function PublicProfileView({ username, onBack }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    setLoading(true); setError('')
    api(`/users/${username}`).then((data) => setProfile(data)).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }, [username])

  async function toggleFollow() {
    try {
      await api(`/follows/${profile.id}`, { method: following ? 'DELETE' : 'POST' })
      setFollowing(!following)
      setProfile({ ...profile, _count: { ...profile._count, followers: Math.max(0, profile._count.followers + (following ? -1 : 1)) } })
    } catch (err) { setError(err.message) }
  }

  if (loading) return <main className="profile-view"><p>Loading profile…</p></main>
  if (error) return <main className="profile-view"><button className="text-button" onClick={onBack}>← Back</button><p className="form-error">{error}</p></main>
  if (!profile) return null

  return <main className="profile-view">
    <button className="text-button" onClick={onBack}>← Back to feed</button>
    <section className="profile-card">
      <div className="profile-avatar">{profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : profile.displayName?.[0] ?? '?'}</div>
      <div><p className="eyebrow">Member</p><h1>{profile.displayName}</h1><p className="profile-handle">@{profile.username}</p></div>
      <p className="profile-bio">{profile.bio || 'No bio added yet.'}</p>
      <div className="profile-stats"><span><strong>{profile._count?.posts ?? 0}</strong> Posts</span><span><strong>{profile._count?.followers ?? 0}</strong> Followers</span><span><strong>{profile._count?.following ?? 0}</strong> Following</span></div>
      <button className="primary-button" onClick={toggleFollow}>{following ? 'Unfollow' : 'Follow'}</button>
    </section>
  </main>
}

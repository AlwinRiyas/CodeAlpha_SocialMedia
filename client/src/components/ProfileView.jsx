export function ProfileView({ user, onBack }) {
  return (
    <main className="profile-view">
      <button className="text-button" onClick={onBack}>← Back to feed</button>
      <section className="profile-card">
        <div className="profile-avatar">{user.displayName?.[0] ?? '?'}</div>
        <div><p className="eyebrow">Profile</p><h1>{user.displayName}</h1><p className="profile-handle">@{user.username}</p></div>
        <p className="profile-bio">{user.bio || 'No bio added yet.'}</p>
      </section>
    </main>
  )
}

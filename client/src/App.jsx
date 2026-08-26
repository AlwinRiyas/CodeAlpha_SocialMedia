import { useEffect, useState } from 'react'
import { AuthScreen } from './components/AuthScreen.jsx'
import { DiscoverView } from './components/DiscoverView.jsx'
import { NotificationsView } from './components/NotificationsView.jsx'
import { PostCard } from './components/PostCard.jsx'
import { ProfileView } from './components/ProfileView.jsx'
import { PublicProfileView } from './components/PublicProfileView.jsx'
import { api } from './lib/api.js'
import { clearToken, getToken } from './lib/auth.js'
import { connectNotifications, disconnectSocket, socket } from './lib/socket.js'

function App() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [view, setView] = useState('home')
  const [selectedUsername, setSelectedUsername] = useState(null)
  const [unread, setUnread] = useState(0)

  async function loadFeed() { try { const data = await api('/posts'); setPosts(data.items) } catch (err) { setError(err.message) } }
  async function loadUnread() { try { const data = await api('/notifications/unread-count'); setUnread(data.count) } catch {} }

  useEffect(() => { if (!getToken()) return; api('/users/me').then((currentUser) => { setUser(currentUser); return Promise.all([loadFeed(), loadUnread()]) }).catch(() => clearToken()) }, [])
  useEffect(() => {
    if (!user) return
    connectNotifications(user.id)
    const onNotification = () => { if (view !== 'notifications') setUnread((count) => count + 1) }
    socket.on('notification:new', onNotification)
    return () => { socket.off('notification:new', onNotification); disconnectSocket() }
  }, [user, view])

  async function publishPost(event) {
    event.preventDefault(); const text = content.trim(); if (!text) return
    try { const post = await api('/posts', { method: 'POST', body: JSON.stringify({ content: text }) }); setPosts((current) => [post, ...current]); setContent('') } catch (err) { setError(err.message) }
  }
  async function toggleLike(postId) { try { await api(`/likes/${postId}`, { method: 'POST' }); await loadFeed() } catch (err) { setError(err.message) } }
  function openProfile(username) { if (username === user.username) { setSelectedUsername(null); setView('profile'); return }; setSelectedUsername(username); setView('public-profile') }
  function logout() { disconnectSocket(); clearToken(); setUser(null); setPosts([]); setView('home'); setSelectedUsername(null); setUnread(0) }

  if (!user) return <AuthScreen onAuthenticated={(authenticatedUser) => { setUser(authenticatedUser); loadFeed(); loadUnread() }} />

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand">Connect<span>.</span></div>
      <nav>
        <button className={view === 'home' ? 'nav-button active' : 'nav-button'} onClick={() => setView('home')}>Home</button>
        <button className={view === 'discover' ? 'nav-button active' : 'nav-button'} onClick={() => setView('discover')}>Discover</button>
        <button className={view === 'notifications' ? 'nav-button active' : 'nav-button'} onClick={() => { setView('notifications'); setUnread(0) }}>Notifications {unread > 0 && <b className="notification-badge">{unread}</b>}</button>
        <button className={view === 'profile' ? 'nav-button active' : 'nav-button'} onClick={() => { setSelectedUsername(null); setView('profile') }}>Profile</button>
      </nav>
      <button className="primary-button" onClick={logout}>Logout</button>
    </aside>

    {view === 'discover' && <DiscoverView />}
    {view === 'profile' && <ProfileView user={user} onBack={() => setView('home')} onUpdated={setUser} />}
    {view === 'public-profile' && selectedUsername && <PublicProfileView username={selectedUsername} onBack={() => setView('home')} />}
    {view === 'notifications' && <NotificationsView />}
    {view === 'home' && <main className="feed">
      <header className="feed-header"><div><p className="eyebrow">Signed in as @{user.username}</p><h1>Home</h1></div><span className="online">● Live</span></header>
      <form className="composer" onSubmit={publishPost}><textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength="2000" placeholder="What is happening?" /><div className="composer-footer"><span>{content.length}/2000</span><button className="primary-button" type="submit">Post</button></div></form>
      {error && <p className="form-error">{error}</p>}
      <section className="post-list">{posts.map((post) => <PostCard key={post.id} post={post} onLike={toggleLike} onOpenProfile={openProfile} />)}</section>
    </main>}
  </div>
}
export default App

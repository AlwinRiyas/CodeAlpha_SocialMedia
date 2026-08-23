import { useEffect, useState } from 'react'
import { AuthScreen } from './components/AuthScreen.jsx'
import { api } from './lib/api.js'

function App() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  async function loadFeed() {
    try { const data = await api('/posts'); setPosts(data.items) }
    catch (err) { setError(err.message) }
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) return
    api('/users/me').then(setUser).then(loadFeed).catch(() => localStorage.removeItem('token'))
  }, [])

  async function publishPost(event) {
    event.preventDefault(); const text = content.trim(); if (!text) return
    try { const post = await api('/posts', { method: 'POST', body: JSON.stringify({ content: text }) }); setPosts([post, ...posts]); setContent('') }
    catch (err) { setError(err.message) }
  }

  async function toggleLike(postId) {
    try { await api(`/likes/${postId}`, { method: 'POST' }); await loadFeed() }
    catch (err) { setError(err.message) }
  }

  if (!user) return <AuthScreen onAuthenticated={(authenticatedUser) => { setUser(authenticatedUser); loadFeed() }} />

  return <div className="app-shell">
    <aside className="sidebar"><div className="brand">Connect<span>.</span></div><nav><a className="active" href="#feed">Home</a><a href="#explore">Explore</a><a href="#profile">Profile</a></nav><button className="primary-button" onClick={() => { localStorage.removeItem('token'); setUser(null) }}>Logout</button></aside>
    <main className="feed" id="feed"><header className="feed-header"><div><p className="eyebrow">Signed in as @{user.username}</p><h1>Home</h1></div><span className="online">● Live</span></header>
      <form className="composer" onSubmit={publishPost}><textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength="2000" placeholder="What is happening?" /><div className="composer-footer"><span>{content.length}/2000</span><button className="primary-button" type="submit">Post</button></div></form>
      {error && <p className="form-error">{error}</p>}<section className="post-list">{posts.map((post) => <article className="post-card" key={post.id}><div className="avatar">{post.author.displayName?.[0] ?? '?'}</div><div className="post-content"><div className="post-meta"><strong>{post.author.displayName}</strong><span>@{post.author.username}</span></div><p>{post.content}</p><div className="post-actions"><button onClick={() => toggleLike(post.id)}>♡ {post._count.likes}</button><button>◌ {post._count.comments}</button></div></div></article>)}</section>
    </main>
  </div>
}
export default App

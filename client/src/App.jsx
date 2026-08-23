import { useState } from 'react'

const demoPosts = [
  { id: 1, name: 'Alex Morgan', handle: '@alexm', time: '2m', text: 'Building the next version of our social platform. The backend foundation is getting real.', likes: 24, comments: 6 },
  { id: 2, name: 'Maya Chen', handle: '@mayac', time: '18m', text: 'Small iterations, clean commits, and better architecture. That is the workflow.', likes: 41, comments: 9 },
]

function App() {
  const [posts, setPosts] = useState(demoPosts)
  const [content, setContent] = useState('')

  function publishPost(event) {
    event.preventDefault()
    const text = content.trim()
    if (!text) return
    setPosts([{ id: Date.now(), name: 'You', handle: '@you', time: 'now', text, likes: 0, comments: 0 }, ...posts])
    setContent('')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Connect<span>.</span></div>
        <nav>
          <a className="active" href="#feed">Home</a>
          <a href="#explore">Explore</a>
          <a href="#notifications">Notifications</a>
          <a href="#profile">Profile</a>
        </nav>
        <button className="primary-button">Create post</button>
      </aside>

      <main className="feed" id="feed">
        <header className="feed-header"><div><p className="eyebrow">Your network</p><h1>Home</h1></div><span className="online">● Live</span></header>
        <form className="composer" onSubmit={publishPost}>
          <textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength="2000" placeholder="What is happening?" />
          <div className="composer-footer"><span>{content.length}/2000</span><button className="primary-button" type="submit">Post</button></div>
        </form>
        <section className="post-list">
          {posts.map((post) => <article className="post-card" key={post.id}>
            <div className="avatar">{post.name[0]}</div>
            <div className="post-content"><div className="post-meta"><strong>{post.name}</strong><span>{post.handle} · {post.time}</span></div><p>{post.text}</p><div className="post-actions"><button onClick={() => setPosts(posts.map((item) => item.id === post.id ? { ...item, likes: item.likes + 1 } : item))}>♡ {post.likes}</button><button>◌ {post.comments}</button><button>↗ Share</button></div></div>
          </article>)}
        </section>
      </main>

      <aside className="right-panel"><section className="panel-card"><p className="eyebrow">Suggested</p><h2>People to follow</h2>{['Jordan Lee', 'Sam Wilson', 'Priya Shah'].map((name) => <div className="suggestion" key={name}><div className="avatar">{name[0]}</div><span>{name}</span><button>Follow</button></div>)}</section></aside>
    </div>
  )
}

export default App

export function PostCard({ post, onLike }) {
  const author = post.author
  return (
    <article className="post-card">
      <div className="avatar">{author.displayName?.[0] ?? '?'}</div>
      <div className="post-content">
        <div className="post-meta"><strong>{author.displayName}</strong><span>@{author.username}</span></div>
        <p>{post.content}</p>
        <div className="post-actions">
          <button onClick={() => onLike(post.id)}>♡ {post._count.likes}</button>
          <button>◌ {post._count.comments}</button>
        </div>
      </div>
    </article>
  )
}

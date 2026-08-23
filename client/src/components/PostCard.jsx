export function PostCard({ post, onLike, onOpenProfile }) {
  const author = post.author
  return (
    <article className="post-card">
      <button className="avatar profile-link" onClick={() => onOpenProfile(author.username)}>{author.avatarUrl ? <img src={author.avatarUrl} alt="" /> : author.displayName?.[0] ?? '?'}</button>
      <div className="post-content">
        <div className="post-meta"><button className="author-link" onClick={() => onOpenProfile(author.username)}>{author.displayName}</button><span>@{author.username}</span></div>
        <p>{post.content}</p>
        <div className="post-actions"><button onClick={() => onLike(post.id)}>♡ {post._count.likes}</button><button>◌ {post._count.comments}</button></div>
      </div>
    </article>
  )
}

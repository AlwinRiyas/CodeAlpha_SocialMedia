import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

const labels = { LIKE: 'liked your post', COMMENT: 'commented on your post', FOLLOW: 'started following you' }

export function NotificationsView() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { setItems(await api('/notifications')) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function markAllRead() {
    await api('/notifications/read-all', { method: 'PATCH' })
    setItems(items.map((item) => ({ ...item, read: true })))
  }

  return <main className="notifications-view"><header className="view-header"><div><p className="eyebrow">Activity</p><h1>Notifications</h1></div><button className="text-button" onClick={markAllRead}>Mark all as read</button></header>{loading ? <p>Loading notifications…</p> : <section className="notification-list">{items.length === 0 ? <p className="empty-state">No notifications yet.</p> : items.map((item) => <article className={`notification-card ${item.read ? '' : 'unread'}`} key={item.id}><div className="avatar">{item.actor.displayName?.[0] ?? '?'}</div><div><strong>{item.actor.displayName}</strong> <span>{labels[item.type] ?? 'interacted with you'}</span><small>{new Date(item.createdAt).toLocaleString()}</small></div></article>)}</section>}</main>
}

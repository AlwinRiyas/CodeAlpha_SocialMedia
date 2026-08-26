import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

function PersonCard({ person, onRequest }) {
  const [state, setState] = useState('LOADING')

  useEffect(() => {
    api(`/connections/state/${person.id}`).then((data) => setState(data.status)).catch(() => setState('NONE'))
  }, [person.id])

  async function connect() {
    setState('SENDING')
    try { await onRequest(person.id); setState('PENDING_SENT') } catch { setState('NONE') }
  }

  return <article className="person-card">
    <div className="avatar person-avatar">{person.avatarUrl ? <img src={person.avatarUrl} alt="" /> : person.displayName?.[0] ?? '?'}</div>
    <div className="person-info">
      <strong>{person.displayName}</strong>
      <span>@{person.username}</span>
      <p>{person.bio || 'No bio added yet.'}</p>
      <small>{person._count?.followers ?? 0} followers · {person._count?.posts ?? 0} posts</small>
    </div>
    <button className="secondary-button" disabled={['LOADING', 'SENDING', 'PENDING_SENT', 'CONNECTED'].includes(state)} onClick={connect}>
      {state === 'PENDING_SENT' ? 'Requested' : state === 'CONNECTED' ? 'Connected' : state === 'PENDING_RECEIVED' ? 'Respond' : state === 'SENDING' ? 'Sending…' : 'Connect'}
    </button>
  </article>
}

export function DiscoverView() {
  const [people, setPeople] = useState([])
  const [requests, setRequests] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadPeople(value = query) {
    setLoading(true); setError('')
    try { const data = await api(`/users/discover${value.trim() ? `?q=${encodeURIComponent(value.trim())}` : ''}`); setPeople(data) } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  async function loadRequests() {
    try { const data = await api('/connections/requests/incoming'); setRequests(data) } catch {}
  }

  useEffect(() => { loadPeople(''); loadRequests() }, [])

  async function requestConnection(userId) {
    await api(`/connections/${userId}`, { method: 'POST' })
  }

  async function respond(requestId, action) {
    await api(`/connections/requests/${requestId}/${action}`, { method: 'POST' })
    await loadRequests(); await loadPeople()
  }

  function submit(event) { event.preventDefault(); loadPeople() }

  return <main className="discover-view">
    <header className="view-header"><div><p className="eyebrow">Network</p><h1>Discover people</h1></div></header>
    <form className="discover-search" onSubmit={submit}>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, username or bio" maxLength={80} />
      <button className="primary-button" type="submit">Search</button>
    </form>

    {requests.length > 0 && <section className="requests-section">
      <div className="section-heading"><h2>Connection requests</h2><span>{requests.length}</span></div>
      <div className="request-list">{requests.map((request) => <article className="request-card" key={request.id}>
        <div className="avatar">{request.sender.avatarUrl ? <img src={request.sender.avatarUrl} alt="" /> : request.sender.displayName?.[0]}</div>
        <div><strong>{request.sender.displayName}</strong><span>@{request.sender.username}</span></div>
        <div className="request-actions"><button className="primary-button" onClick={() => respond(request.id, 'ACCEPT')}>Accept</button><button className="secondary-button" onClick={() => respond(request.id, 'DECLINE')}>Decline</button></div>
      </article>)}</div>
    </section>}

    <section><div className="section-heading"><h2>{query ? 'Search results' : 'People you may know'}</h2><span>{people.length}</span></div>
      {loading ? <p className="empty-state">Finding people…</p> : error ? <p className="form-error">{error}</p> : <div className="people-grid">{people.map((person) => <PersonCard key={person.id} person={person} onRequest={requestConnection} />)}</div>}
      {!loading && !people.length && !error && <p className="empty-state">No people found.</p>}
    </section>
  </main>
}

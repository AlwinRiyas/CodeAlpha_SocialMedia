const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

export async function api(path, options = {}) {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const body = response.status === 204 ? null : await response.json()
  if (!response.ok) throw new Error(body?.error?.message ?? 'Request failed')
  return body?.data
}

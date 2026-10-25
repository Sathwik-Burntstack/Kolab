import { API_BASE_URL, TOKEN_KEY } from '../config/env'

export class ApiError extends Error {
  constructor(message, status, data) { super(message); this.status = status; this.data = data }
}

/** Thin fetch wrapper: JSON in/out, bearer token from localStorage, query-string helper. */
export async function http({ method = 'GET', path }, { body, query, headers, formData } = {}) {
  const params = new URLSearchParams()
  if (query) Object.entries(query).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') params.set(k, v) })
  const qs = params.toString()
  const url = `${API_BASE_URL}${path}${qs ? `?${qs}` : ''}`
  const token = localStorage.getItem(TOKEN_KEY)
  const res = await fetch(url, {
    method,
    headers: {
      ...(formData ? {} : body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: formData || (body ? JSON.stringify(body) : undefined),
  })
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!res.ok) throw new ApiError((data && data.message) || res.statusText || 'Request failed', res.status, data)
  return data
}

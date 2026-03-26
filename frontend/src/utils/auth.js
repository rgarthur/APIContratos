const STORAGE_KEY = 'api-contratos-session'

function parseJwtSegment(segment) {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return JSON.parse(atob(padded))
}

export function decodeToken(token) {
  if (!token) {
    return null
  }

  const [, payloadSegment] = token.split('.')

  if (!payloadSegment) {
    return null
  }

  const payload = parseJwtSegment(payloadSegment)

  return {
    id:
      payload.nameid ??
      payload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ] ??
      '',
    name:
      payload.unique_name ??
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
      '',
    email:
      payload.email ??
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
      '',
    role:
      payload.role ??
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      'User',
    expiresAt: payload.exp ? payload.exp * 1000 : null,
  }
}

export function getStoredSession() {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return { token: '', user: null }
  }

  try {
    const stored = JSON.parse(raw)
    const user = decodeToken(stored.token)

    if (!stored.token || !user) {
      localStorage.removeItem(STORAGE_KEY)
      return { token: '', user: null }
    }

    if (user.expiresAt && Date.now() > user.expiresAt) {
      localStorage.removeItem(STORAGE_KEY)
      return { token: '', user: null }
    }

    return {
      token: stored.token,
      user,
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return { token: '', user: null }
  }
}

export function saveSession(token) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token }))
  return {
    token,
    user: decodeToken(token),
  }
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}

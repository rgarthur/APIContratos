const DEFAULT_API_BASE_URL = '/api'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? DEFAULT_API_BASE_URL

function buildUrl(path, query) {
  const requestPath = `${API_BASE_URL}${path}`
  const url = API_BASE_URL.startsWith('http')
    ? new URL(requestPath)
    : new URL(requestPath, window.location.origin)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return
      }

      url.searchParams.set(key, value)
    })
  }

  return url
}

async function parseBody(response) {
  const contentType = response.headers.get('content-type') ?? ''

  if (response.status === 204) {
    return null
  }

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function getErrorMessage(body, fallback) {
  if (!body) {
    return fallback
  }

  if (typeof body === 'string') {
    return body
  }

  if (typeof body.erro === 'string') {
    return body.erro
  }

  if (typeof body.mensagem === 'string') {
    return body.mensagem
  }

  return fallback
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', token, body, query } = options
  const isFormData = body instanceof FormData

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  })

  const parsedBody = await parseBody(response)

  if (!response.ok) {
    const error = new Error(
      getErrorMessage(parsedBody, 'Nao foi possivel concluir a requisicao.')
    )

    error.status = response.status
    error.body = parsedBody
    throw error
  }

  return parsedBody
}

export async function apiList(path, options = {}) {
  try {
    const response = await apiRequest(path, options)
    return Array.isArray(response) ? response : []
  } catch (error) {
    if (error.status === 404) {
      return []
    }

    throw error
  }
}

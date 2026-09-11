const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export async function fetchActivities(category = '') {
  const params = category ? `?category=${encodeURIComponent(category)}` : ''
  const response = await fetch(`${API_URL}/api/activities${params}`)

  if (!response.ok) {
    throw new Error('Não foi possível carregar as atividades')
  }

  const payload = await response.json()
  return payload.items ?? []
}

import type { LiveBriefingResponse, LocationProfile } from '../types'

function ensureArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

export async function fetchLiveBriefing(profile: LocationProfile): Promise<LiveBriefingResponse> {
  const response = await fetch(profile.briefingUrl, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Feed request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as Partial<LiveBriefingResponse>

  if (!payload.outlook || !payload.weather) {
    throw new Error('Feed response is missing required briefing fields.')
  }

  return {
    outlook: payload.outlook,
    weather: payload.weather,
    hazards: ensureArray(payload.hazards),
    news: ensureArray(payload.news),
    sources: ensureArray(payload.sources),
    actions: ensureArray(payload.actions),
    refreshedAt: payload.refreshedAt,
  }
}

import type {
  AppSetup,
  Coordinates,
  FeedFetchStatus,
  LocationProfile,
  LiveBriefingResponse,
  UnitSystem,
  WeatherSnapshot,
} from '../types'

const SETUP_STORAGE_KEY = 'emergency-centre.setup.v1'

function createEmptyWeather(): WeatherSnapshot {
  return {
    temperatureC: 0,
    condition: 'Awaiting live weather feed',
    windKph: 0,
    rainChance: 0,
    advisory: 'Connect a live briefing feed to populate weather conditions.',
  }
}

function normalizeList(value: unknown) {
  return Array.isArray(value)
    ? value
        .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
        .filter(Boolean)
    : []
}

function normalizeFetchStatus(value: unknown): FeedFetchStatus {
  return value === 'syncing' || value === 'live' || value === 'error' ? value : 'idle'
}

function normalizeUnitSystem(value: unknown): UnitSystem {
  return value === 'imperial' ? 'imperial' : 'metric'
}

function normalizeProfile(raw: unknown, index: number): LocationProfile | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const candidate = raw as Partial<LocationProfile>
  const name = typeof candidate.name === 'string' ? candidate.name.trim() : ''
  const region = typeof candidate.region === 'string' ? candidate.region.trim() : ''
  const country = typeof candidate.country === 'string' ? candidate.country.trim() : ''
  const briefingUrl = typeof candidate.briefingUrl === 'string' ? candidate.briefingUrl.trim() : ''
  const lat = Number(candidate.coordinates?.lat)
  const lng = Number(candidate.coordinates?.lng)

  if (!name || !region || !country || !briefingUrl || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null
  }

  return {
    id:
      typeof candidate.id === 'string' && candidate.id.trim()
        ? candidate.id
        : `${name}-${region}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    region,
    country,
    aliases: normalizeList(candidate.aliases),
    locationCodes: normalizeList(candidate.locationCodes),
    coordinates: { lat, lng },
    briefingUrl,
    outlook:
      typeof candidate.outlook === 'string' && candidate.outlook.trim()
        ? candidate.outlook
        : 'Awaiting first live briefing sync.',
    weather: candidate.weather ?? createEmptyWeather(),
    hazards: Array.isArray(candidate.hazards) ? candidate.hazards : [],
    news: Array.isArray(candidate.news) ? candidate.news : [],
    sources: Array.isArray(candidate.sources) ? candidate.sources : [],
    actions: Array.isArray(candidate.actions) ? candidate.actions : [],
    lastUpdatedAt:
      typeof candidate.lastUpdatedAt === 'string' && candidate.lastUpdatedAt.trim()
        ? candidate.lastUpdatedAt
        : 'Never synced',
    fetchStatus: normalizeFetchStatus(candidate.fetchStatus),
    fetchError: typeof candidate.fetchError === 'string' && candidate.fetchError.trim() ? candidate.fetchError : null,
  }
}

export function createEmptyProfile(config: {
  name: string
  region: string
  country: string
  aliases: string[]
  locationCodes: string[]
  coordinates: Coordinates
  briefingUrl: string
}): LocationProfile {
  return {
    id: `${config.name}-${config.region}-${Date.now()}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, ''),
    name: config.name,
    region: config.region,
    country: config.country,
    aliases: config.aliases,
    locationCodes: config.locationCodes,
    coordinates: config.coordinates,
    briefingUrl: config.briefingUrl,
    outlook: 'Awaiting first live briefing sync.',
    weather: createEmptyWeather(),
    hazards: [],
    news: [],
    sources: [],
    actions: [],
    lastUpdatedAt: 'Never synced',
    fetchStatus: 'idle',
    fetchError: null,
  }
}

export function mergeLiveBriefing(
  profile: LocationProfile,
  briefing: LiveBriefingResponse,
): LocationProfile {
  return {
    ...profile,
    outlook: briefing.outlook,
    weather: briefing.weather,
    hazards: briefing.hazards,
    news: briefing.news,
    sources: briefing.sources,
    actions: briefing.actions,
    lastUpdatedAt: briefing.refreshedAt ?? new Date().toISOString(),
    fetchStatus: 'live',
    fetchError: null,
  }
}

export function markProfileFetchError(profile: LocationProfile, message: string): LocationProfile {
  return {
    ...profile,
    fetchStatus: 'error',
    fetchError: message,
    lastUpdatedAt: profile.lastUpdatedAt || 'Sync failed',
  }
}

export function markProfileSyncing(profile: LocationProfile): LocationProfile {
  return {
    ...profile,
    fetchStatus: 'syncing',
    fetchError: null,
  }
}

export function createDefaultSetup(): AppSetup {
  return {
    pollingIntervalSeconds: 120,
    soundEnabled: true,
    soundVolume: 0.45,
    unitSystem: 'metric',
    coverageProfiles: [],
  }
}

export function readAppSetup(): AppSetup {
  if (typeof window === 'undefined') {
    return createDefaultSetup()
  }

  const raw = window.localStorage.getItem(SETUP_STORAGE_KEY)

  if (!raw) {
    return createDefaultSetup()
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AppSetup>
    return {
      pollingIntervalSeconds: Math.max(30, Number(parsed.pollingIntervalSeconds) || 120),
      soundEnabled: parsed.soundEnabled ?? true,
      soundVolume: Math.min(1, Math.max(0, Number(parsed.soundVolume) || 0.45)),
      unitSystem: normalizeUnitSystem(parsed.unitSystem),
      coverageProfiles: Array.isArray(parsed.coverageProfiles)
        ? parsed.coverageProfiles
            .map((profile, index) => normalizeProfile(profile, index))
            .filter((profile): profile is LocationProfile => profile !== null)
        : [],
    }
  } catch {
    return createDefaultSetup()
  }
}

export function writeAppSetup(setup: AppSetup) {
  if (typeof window === 'undefined') {
    return
  }

  const serializedSetup = {
    pollingIntervalSeconds: setup.pollingIntervalSeconds,
    soundEnabled: setup.soundEnabled,
    soundVolume: setup.soundVolume,
    unitSystem: setup.unitSystem,
    coverageProfiles: setup.coverageProfiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      region: profile.region,
      country: profile.country,
      aliases: profile.aliases,
      locationCodes: profile.locationCodes,
      coordinates: profile.coordinates,
      briefingUrl: profile.briefingUrl,
    })),
  }

  window.localStorage.setItem(
    SETUP_STORAGE_KEY,
    JSON.stringify(serializedSetup),
  )
}

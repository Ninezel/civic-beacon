export type SignalCategory =
  | 'weather'
  | 'storm'
  | 'flood'
  | 'earthquake'
  | 'wildfire'
  | 'heat'
  | 'air-quality'
  | 'infrastructure'
  | 'transport'
  | 'airspace'
  | 'public-safety'
  | 'civil-defense'
  | 'other'

export type HazardCategory = SignalCategory

export type Severity = 'Critical' | 'High' | 'Moderate' | 'Advisory'
export type LocationMode = 'directory' | 'search' | 'suggestion'
export type FeedFetchStatus = 'idle' | 'syncing' | 'live' | 'error'
export type UnitSystem = 'metric' | 'imperial'

export interface Coordinates {
  lat: number
  lng: number
}

export interface WeatherSnapshot {
  temperatureC: number
  condition: string
  windKph: number
  rainChance: number
  advisory: string
}

export interface NewsItem {
  id: string
  headline: string
  source: string
  publishedAt: string
  summary: string
  scope: 'Local' | 'Regional' | 'National' | 'Global'
}

export interface SignalItem {
  id: string
  title: string
  category: SignalCategory
  severity: Severity
  status: 'Live' | 'Monitoring' | 'Recovery'
  issuedAt: string
  source: string
  coverage: string
  summary: string
  hotspotLabel: string
  reactionCount: number
  tags: string[]
}

export type HazardSignal = SignalItem

export interface SourceHealth {
  id: string
  name: string
  type:
    | 'Weather'
    | 'Hydrology'
    | 'Seismic'
    | 'Wildfire'
    | 'Airspace'
    | 'Transport'
    | 'Infrastructure'
    | 'News'
    | 'Civil'
    | 'Other'
  status: 'Healthy' | 'Delayed' | 'Manual review'
  lastSync: string
  note: string
}

export interface ReadinessAction {
  id: string
  title: string
  description: string
  whenToUse: string
}

export interface LocationProfile {
  id: string
  name: string
  region: string
  country: string
  aliases: string[]
  locationCodes: string[]
  coordinates: Coordinates
  briefingUrl: string
  outlook: string
  weather: WeatherSnapshot
  signals: SignalItem[]
  news: NewsItem[]
  sources: SourceHealth[]
  actions: ReadinessAction[]
  lastUpdatedAt: string
  fetchStatus: FeedFetchStatus
  fetchError: string | null
}

export interface LocationSuggestion {
  id: string
  profile: LocationProfile
  primaryLabel: string
  secondaryLabel: string
  matchedText: string
  matchKind: 'code' | 'alias' | 'place' | 'region' | 'country'
}

export interface LiveBriefingResponse {
  outlook: string
  weather: WeatherSnapshot
  signals: SignalItem[]
  news: NewsItem[]
  sources: SourceHealth[]
  actions: ReadinessAction[]
  refreshedAt?: string
}

export interface AppSetup {
  pollingIntervalSeconds: number
  soundEnabled: boolean
  soundVolume: number
  unitSystem: UnitSystem
  coverageProfiles: LocationProfile[]
}

export interface CoverageDraft {
  name: string
  region: string
  country: string
  aliases: string[]
  locationCodes: string[]
  latitude: number
  longitude: number
  briefingUrl: string
}

export interface CoverageZoneTemplate {
  id: string
  name: string
  region: string
  regionCode: string
  country: string
  countryCode: string
  aliases: string[]
  locationCodes: string[]
  coordinates: Coordinates
}

export interface CoverageZoneSuggestion {
  id: string
  zone: CoverageZoneTemplate
  matchedText: string
  matchKind: 'code' | 'alias' | 'place' | 'region' | 'country'
}

export type SetupSettingsUpdate = Partial<
  Pick<AppSetup, 'pollingIntervalSeconds' | 'soundEnabled' | 'soundVolume' | 'unitSystem'>
>

export interface SelectedLocation {
  label: string
  coordinates: Coordinates
  mode: LocationMode
  profile: LocationProfile
  confidenceLabel: string
}

export interface LocationBriefing {
  selectedLocation: SelectedLocation
  headline: string
  metrics: {
    activeSignals: number
    criticalSignals: number
    monitoredCategories: number
    sourceConfidence: string
    lastRefresh: string
  }
  signalFeed: SignalItem[]
  weather: WeatherSnapshot
  newsFeed: NewsItem[]
  sourceHealth: SourceHealth[]
  actions: ReadinessAction[]
}

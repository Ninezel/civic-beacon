import type {
  LocationProfile,
  LocationSuggestion,
  SelectedLocation,
} from '../types'

function normalizeQuery(value: string) {
  return value.trim().toLowerCase()
}

function normalizeCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
}

function createDirectoryDescription(profile: LocationProfile) {
  return `${profile.region} · ${profile.country}`
}

function scoreTextMatch(query: string, value: string) {
  const normalizedValue = value.toLowerCase()

  if (normalizedValue === query) {
    return 0
  }

  if (normalizedValue.startsWith(query) || query.startsWith(normalizedValue)) {
    return 1
  }

  if (normalizedValue.includes(query) || query.includes(normalizedValue)) {
    return 2
  }

  return Number.POSITIVE_INFINITY
}

function scoreCodeMatch(query: string, value: string) {
  const normalizedQuery = normalizeCode(query)
  const normalizedValue = normalizeCode(value)

  if (!normalizedQuery || !normalizedValue) {
    return Number.POSITIVE_INFINITY
  }

  if (normalizedQuery === normalizedValue) {
    return 0
  }

  if (normalizedQuery.startsWith(normalizedValue) || normalizedValue.startsWith(normalizedQuery)) {
    return 1
  }

  if (normalizedQuery.includes(normalizedValue) || normalizedValue.includes(normalizedQuery)) {
    return 2
  }

  return Number.POSITIVE_INFINITY
}

function buildSuggestion(
  profile: LocationProfile,
  matchedText: string,
  matchKind: LocationSuggestion['matchKind'],
  rank: number,
): LocationSuggestion {
  return {
    id: `${profile.id}-${matchKind}-${rank}`,
    profile,
    primaryLabel: profile.name,
    secondaryLabel: `${createDirectoryDescription(profile)} · ${profile.locationCodes.join(', ')}`,
    matchedText,
    matchKind,
  }
}

export function createDirectorySelection(profile: LocationProfile): SelectedLocation {
  return {
    label: `${profile.name}, ${profile.country}`,
    coordinates: profile.coordinates,
    mode: 'directory',
    profile,
    confidenceLabel: 'Matched to a known coverage area',
  }
}

export function createSearchSelection(
  profile: LocationProfile,
  matchedText: string,
  mode: SelectedLocation['mode'] = 'search',
): SelectedLocation {
  return {
    label: `${profile.name}, ${profile.country}`,
    coordinates: profile.coordinates,
    mode,
    profile,
    confidenceLabel: `Coverage area matched using "${matchedText}"`,
  }
}

export function findProfileById(profiles: LocationProfile[], profileId: string) {
  return profiles.find((profile) => profile.id === profileId) ?? null
}

export function getCoverageCountries(profiles: LocationProfile[]) {
  return [...new Set(profiles.map((profile) => profile.country))].sort((left, right) =>
    left.localeCompare(right),
  )
}

export function getCoverageRegions(profiles: LocationProfile[], country: string) {
  return [...new Set(
    profiles
      .filter((profile) => !country || profile.country === country)
      .map((profile) => profile.region),
  )].sort((left, right) => left.localeCompare(right))
}

export function filterCoverageProfiles(
  profiles: LocationProfile[],
  country: string,
  region: string,
) {
  return profiles
    .filter((profile) => !country || profile.country === country)
    .filter((profile) => !region || profile.region === region)
    .sort((left, right) => left.name.localeCompare(right.name))
}

export function getLocationSuggestions(
  profiles: LocationProfile[],
  query: string,
  limit = 6,
): LocationSuggestion[] {
  const normalized = normalizeQuery(query)

  if (!normalized) {
    return profiles.slice(0, limit).map((profile, index) =>
      buildSuggestion(profile, profile.locationCodes[0] ?? profile.name, 'place', index),
    )
  }

  const candidates = profiles.flatMap((profile) => {
    const rankedEntries = [
      ...profile.locationCodes.map((code) => ({
        value: code,
        kind: 'code' as const,
        rank: scoreCodeMatch(query, code),
      })),
      ...profile.aliases.map((alias) => ({ value: alias, kind: 'alias' as const })),
      { value: profile.name, kind: 'place' as const },
      { value: profile.region, kind: 'region' as const },
      { value: profile.country, kind: 'country' as const },
    ]
      .map((entry) => ({
        ...entry,
        rank:
          entry.kind === 'code' && 'rank' in entry
            ? entry.rank
            : scoreTextMatch(normalized, entry.value),
      }))
      .filter((entry) => Number.isFinite(entry.rank))
      .sort((left, right) => left.rank - right.rank)

    if (rankedEntries.length === 0) {
      return []
    }

    const bestEntry = rankedEntries[0]
    return [buildSuggestion(profile, bestEntry.value, bestEntry.kind, bestEntry.rank)]
  })

  return candidates
    .sort((left, right) => {
      const leftScore =
        left.matchKind === 'code'
          ? scoreCodeMatch(query, left.matchedText)
          : scoreTextMatch(normalized, left.matchedText)
      const rightScore =
        right.matchKind === 'code'
          ? scoreCodeMatch(query, right.matchedText)
          : scoreTextMatch(normalized, right.matchedText)

      if (leftScore !== rightScore) {
        return leftScore - rightScore
      }

      return left.primaryLabel.localeCompare(right.primaryLabel)
    })
    .slice(0, limit)
}

export function findBestSuggestion(
  profiles: LocationProfile[],
  query: string,
) {
  return getLocationSuggestions(profiles, query, 1)[0] ?? null
}

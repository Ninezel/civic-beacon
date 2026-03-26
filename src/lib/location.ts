import type {
  LocationProfile,
  LocationSuggestion,
  SelectedLocation,
} from '../types'

function normalizeQuery(value: string) {
  return value.trim().toLowerCase()
}

function createDirectoryDescription(profile: LocationProfile) {
  return `${profile.region} · ${profile.country}`
}

function scoreMatch(query: string, value: string) {
  const normalizedValue = value.toLowerCase()

  if (normalizedValue === query) {
    return 0
  }

  if (normalizedValue.startsWith(query)) {
    return 1
  }

  if (normalizedValue.includes(query)) {
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
      ...profile.locationCodes.map((code) => ({ value: code, kind: 'code' as const })),
      ...profile.aliases.map((alias) => ({ value: alias, kind: 'alias' as const })),
      { value: profile.name, kind: 'place' as const },
      { value: profile.region, kind: 'region' as const },
      { value: profile.country, kind: 'country' as const },
    ]
      .map((entry) => ({
        ...entry,
        rank: scoreMatch(normalized, entry.value),
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
      const leftScore = scoreMatch(normalized, left.matchedText)
      const rightScore = scoreMatch(normalized, right.matchedText)

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

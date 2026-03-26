import type { HazardSignal, LocationBriefing, SelectedLocation, Severity } from '../types'

const severityRank: Record<Severity, number> = {
  Critical: 0,
  High: 1,
  Moderate: 2,
  Advisory: 3,
}

function sortHazards(feed: HazardSignal[]) {
  return [...feed].sort((left, right) => severityRank[left.severity] - severityRank[right.severity])
}

function describeRefresh(profile: SelectedLocation['profile']) {
  if (profile.fetchStatus === 'syncing') {
    return 'Syncing live feed now'
  }

  if (profile.fetchStatus === 'error') {
    return profile.fetchError ? `Sync issue: ${profile.fetchError}` : 'Live feed needs attention'
  }

  if (profile.fetchStatus === 'idle') {
    return 'Waiting for first live sync'
  }

  return `Last refreshed ${profile.lastUpdatedAt}`
}

export function buildLocationBriefing(selectedLocation: SelectedLocation): LocationBriefing {
  const hazardFeed = sortHazards(selectedLocation.profile.hazards)
  const criticalSignals = hazardFeed.filter((signal) => signal.severity === 'Critical').length
  const areaLabel = selectedLocation.profile.name

  return {
    selectedLocation,
    headline:
      criticalSignals > 0
        ? `${criticalSignals} critical alert${criticalSignals === 1 ? '' : 's'} need attention in ${areaLabel}.`
        : `No critical alerts are active in ${areaLabel}. Continue monitoring local conditions.`,
    metrics: {
      activeSignals: hazardFeed.length,
      criticalSignals,
      sourceConfidence: selectedLocation.confidenceLabel,
      lastRefresh: describeRefresh(selectedLocation.profile),
    },
    hazardFeed,
    weather: selectedLocation.profile.weather,
    newsFeed: selectedLocation.profile.news,
    sourceHealth: selectedLocation.profile.sources,
    actions: selectedLocation.profile.actions,
  }
}

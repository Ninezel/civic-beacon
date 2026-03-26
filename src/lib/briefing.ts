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
      lastRefresh: 'Mock network refreshed just now',
    },
    hazardFeed,
    weather: selectedLocation.profile.weather,
    newsFeed: selectedLocation.profile.news,
    sourceHealth: selectedLocation.profile.sources,
    actions: selectedLocation.profile.actions,
  }
}

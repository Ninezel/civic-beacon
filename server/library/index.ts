import type { CoverageZoneTemplate } from '../../src/types.js'
import { buildDemoBriefing } from '../services/demoBriefingService.js'
import { buildLiveBriefing } from '../services/liveBriefingService.js'
import { resolveCoverageZone } from './catalog.js'

export * from './catalog.js'
export * from './providers.js'
export type {
  BriefingFreshness,
  CoverageZoneProviderConfig,
  CoverageZoneSuggestion,
  CoverageZoneTemplate,
  LiveBriefingResponse,
  NewsItem,
  ReadinessAction,
  SignalCategory,
  SignalItem,
  SourceHealth,
  SourceTransport,
  WeatherSnapshot,
} from '../../src/types.js'

export async function buildCoverageZoneBriefing(zoneOrId: CoverageZoneTemplate | string) {
  const zone = resolveCoverageZone(zoneOrId)
  return buildLiveBriefing(zone)
}

export function buildDemoCoverageZoneBriefing(zoneOrId: CoverageZoneTemplate | string) {
  const zone = resolveCoverageZone(zoneOrId)
  return buildDemoBriefing(zone)
}

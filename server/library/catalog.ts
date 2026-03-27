import { coverageCatalogData } from '../../src/data/coverageCatalogData.js'
import type { CoverageZoneTemplate } from '../../src/types.js'
import {
  getCoverageZoneById,
  listCoverageCountries,
  listCoverageRegions,
  listCoverageZones,
  lookupCoverageZones,
} from '../services/catalogService.js'

export { coverageCatalogData }

export {
  getCoverageZoneById as getBuiltInCoverageZone,
  listCoverageCountries as listBuiltInCoverageCountries,
  listCoverageRegions as listBuiltInCoverageRegions,
  listCoverageZones as listBuiltInCoverageZones,
  lookupCoverageZones as lookupBuiltInCoverageZones,
}

export function resolveCoverageZone(zoneOrId: CoverageZoneTemplate | string): CoverageZoneTemplate {
  if (typeof zoneOrId !== 'string') {
    return zoneOrId
  }

  const zone = getCoverageZoneById(zoneOrId)

  if (!zone) {
    throw new Error(`No built-in coverage zone was found for "${zoneOrId}".`)
  }

  return zone
}

import type { CoverageZoneProviderConfig, CoverageZoneTemplate } from '../../src/types.js'
import { fetchEnvironmentAgencyProvider } from '../services/providers/environmentAgencyProvider.js'
import { fetchMetOfficeProvider } from '../services/providers/metOfficeProvider.js'
import { fetchNwsProvider } from '../services/providers/nwsProvider.js'
import type { ProviderContribution } from '../services/providers/shared.js'
import { fetchUsgsProvider } from '../services/providers/usgsProvider.js'
import { resolveCoverageZone } from './catalog.js'

const providerFetchers: Record<
  CoverageZoneProviderConfig['id'],
  (zone: CoverageZoneTemplate) => Promise<ProviderContribution>
> = {
  nws: fetchNwsProvider,
  'met-office': fetchMetOfficeProvider,
  'environment-agency': fetchEnvironmentAgencyProvider,
  usgs: fetchUsgsProvider,
}

export type { ProviderContribution } from '../services/providers/shared.js'
export { fetchEnvironmentAgencyProvider, fetchMetOfficeProvider, fetchNwsProvider, fetchUsgsProvider }

export async function fetchCoverageZoneProvider(
  zoneOrId: CoverageZoneTemplate | string,
  providerId: CoverageZoneProviderConfig['id'],
) {
  const zone = resolveCoverageZone(zoneOrId)
  return providerFetchers[providerId](zone)
}

export async function fetchCoverageZoneProviders(zoneOrId: CoverageZoneTemplate | string) {
  const zone = resolveCoverageZone(zoneOrId)

  return Promise.all(
    zone.providers.map(async (provider) => ({
      provider,
      contribution: await fetchCoverageZoneProvider(zone, provider.id),
    })),
  )
}

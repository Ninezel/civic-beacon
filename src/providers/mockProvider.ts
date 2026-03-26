import { networkProfiles } from '../data/mockNetwork'
import type { HazardProvider } from '../types'

/**
 * Baseline local provider used by the open-source build.
 * Future integrations can implement the same contract with live weather,
 * flood, seismic, and newsroom data sources.
 */
export const mockProvider: HazardProvider = {
  name: 'Local mock provider',
  getCoverageProfiles: () => networkProfiles,
  getDefaultProfile: () => networkProfiles[0],
}

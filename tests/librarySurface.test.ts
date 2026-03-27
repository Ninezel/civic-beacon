import { describe, expect, it } from 'vitest'
import {
  buildDemoCoverageZoneBriefing,
  getBuiltInCoverageZone,
  listBuiltInCoverageCountries,
  resolveCoverageZone,
} from '../server/library/index'

describe('node library surface', () => {
  it('lists the built-in coverage countries', () => {
    expect(listBuiltInCoverageCountries()).toEqual(
      expect.arrayContaining([
        { code: 'GB', label: 'United Kingdom' },
        { code: 'US', label: 'United States' },
      ]),
    )
  })

  it('resolves a built-in coverage zone from its id', () => {
    const zone = resolveCoverageZone('gb-eng-greater-manchester')

    expect(zone.name).toBe('Greater Manchester Core')
    expect(zone.providers.length).toBeGreaterThan(0)
    expect(getBuiltInCoverageZone(zone.id)?.id).toBe(zone.id)
  })

  it('builds a demo briefing from the public library API', () => {
    const briefing = buildDemoCoverageZoneBriefing('gb-eng-greater-manchester')

    expect(briefing.outlook).toContain('Greater Manchester Core')
    expect(briefing.weather.condition.length).toBeGreaterThan(0)
    expect(briefing.signals.length).toBeGreaterThan(0)
  })
})

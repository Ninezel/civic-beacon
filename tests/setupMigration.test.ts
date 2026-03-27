import { describe, expect, it } from 'vitest'
import { upgradeKnownStarterBriefingUrl } from '../src/lib/setup'

describe('setup route migration', () => {
  it('upgrades built-in demo routes to live routes', () => {
    expect(upgradeKnownStarterBriefingUrl('/api/briefings/demo/gb-eng-greater-manchester')).toBe(
      '/api/briefings/live/gb-eng-greater-manchester',
    )
  })

  it('preserves the existing host when upgrading absolute starter routes', () => {
    expect(
      upgradeKnownStarterBriefingUrl('http://localhost:8787/api/briefings/demo/us-ca-san-francisco-bay'),
    ).toBe('http://localhost:8787/api/briefings/live/us-ca-san-francisco-bay')
  })

  it('leaves unrelated custom feed routes untouched', () => {
    expect(upgradeKnownStarterBriefingUrl('https://signals.example.com/api/manchester.json')).toBe(
      'https://signals.example.com/api/manchester.json',
    )
  })

  it('leaves unknown demo routes untouched', () => {
    expect(upgradeKnownStarterBriefingUrl('/api/briefings/demo/custom-manual-zone')).toBe(
      '/api/briefings/demo/custom-manual-zone',
    )
  })
})

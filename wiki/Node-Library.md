# Node Library

Emergency Centre `v1.0.0` can be used as a reusable Node library as well as a web app and local API service.

## What You Can Reuse

- built-in coverage catalog lookup
- official-provider adapters for `NWS`, `Met Office`, `Environment Agency`, and `USGS`
- normalized live briefing generation
- deterministic demo briefing generation for local testing

## Install From GitHub

```bash
npm install github:Ninezel/emergency-centre
```

Recommended runtime:

- `Node.js 20+`

## Main Entry Points

- `emergency-centre`
- `emergency-centre/catalog`
- `emergency-centre/providers`

## Example

```ts
import {
  buildCoverageZoneBriefing,
  fetchCoverageZoneProviders,
  getBuiltInCoverageZone,
} from 'emergency-centre'

const zone = getBuiltInCoverageZone('gb-eng-greater-manchester')

if (!zone) {
  throw new Error('Coverage zone not found.')
}

const briefing = await buildCoverageZoneBriefing(zone)
const providers = await fetchCoverageZoneProviders(zone)

console.log(briefing.outlook)
console.log(providers.map((entry) => entry.provider.label))
```

## Notes

- The library uses the same allowlisted provider stack as the built-in API routes.
- It is not a generic unrestricted scraping framework.
- If you run your own service on top of it, you own caching, rate limiting, provenance labeling, and trust posture for that deployment.
- If you need an HTTP service instead of direct imports, see [[API Services]].

# Node Library Guide

Emergency Centre can now be used as a reusable Node library as well as a local API service and web app.

This is useful when you want to:

- reuse the built-in coverage catalog in another project
- call the official-provider adapters directly
- generate normalized live briefings without standing up the Emergency Centre UI
- build your own API, cron job, bot, dashboard, or webhook worker on top of the same scraper stack

## Install From GitHub

Recommended runtime:

- `Node.js 20+`

```bash
npm install github:Ninezel/emergency-centre
```

The package runs `npm run build:api` during `prepare`, so the compiled Node library is available after install.

## Entry Points

### `emergency-centre`

High-level entrypoint for catalog helpers, provider access, demo briefing generation, and live briefing generation.

```ts
import {
  buildCoverageZoneBriefing,
  buildDemoCoverageZoneBriefing,
  fetchCoverageZoneProviders,
  getBuiltInCoverageZone,
  listBuiltInCoverageCountries,
} from 'emergency-centre'
```

### `emergency-centre/catalog`

Catalog-only helpers.

```ts
import {
  coverageCatalogData,
  getBuiltInCoverageZone,
  listBuiltInCoverageCountries,
  listBuiltInCoverageRegions,
  listBuiltInCoverageZones,
  lookupBuiltInCoverageZones,
  resolveCoverageZone,
} from 'emergency-centre/catalog'
```

### `emergency-centre/providers`

Low-level provider access.

```ts
import {
  fetchCoverageZoneProvider,
  fetchCoverageZoneProviders,
  fetchEnvironmentAgencyProvider,
  fetchMetOfficeProvider,
  fetchNwsProvider,
  fetchUsgsProvider,
} from 'emergency-centre/providers'
```

## Built-In Providers

The current built-in provider stack is:

- `NWS` forecasts and active alerts for United States starter zones
- `Met Office` public forecast-page scraping plus warning RSS for United Kingdom starter zones
- `Environment Agency` flood warnings for England starter zones
- `USGS` earthquake feeds for nearby seismic activity

## Examples

### Build A Normalized Briefing

```ts
import { buildCoverageZoneBriefing } from 'emergency-centre'

const briefing = await buildCoverageZoneBriefing('gb-eng-greater-manchester')

console.log(briefing.outlook)
console.log(briefing.weather)
console.log(briefing.signals)
```

### Pull Each Provider Separately

```ts
import { fetchCoverageZoneProviders } from 'emergency-centre'

const providers = await fetchCoverageZoneProviders('gb-eng-greater-manchester')

for (const entry of providers) {
  console.log(entry.provider.id, entry.provider.label)
  console.log(entry.contribution.sources)
}
```

### Use A Custom Zone Object

You do not have to use only the built-in catalog. High-level library functions accept either a built-in zone id or a full `CoverageZoneTemplate`.

```ts
import { buildCoverageZoneBriefing, type CoverageZoneTemplate } from 'emergency-centre'

const zone: CoverageZoneTemplate = {
  id: 'custom-london',
  name: 'Custom London',
  region: 'Greater London',
  regionCode: 'greater-london',
  country: 'United Kingdom',
  countryCode: 'GB',
  aliases: ['Central London'],
  locationCodes: ['SW1A'],
  coordinates: { lat: 51.5074, lng: -0.1278 },
  providers: [
    {
      id: 'met-office',
      label: 'Met Office',
      forecastPageUrl: 'https://weather.metoffice.gov.uk/forecast/gcpvj0v07',
      warningsUrl: 'https://weather.metoffice.gov.uk/public/data/PWSCache/WarningsRSS/Region/se',
    },
  ],
}

const briefing = await buildCoverageZoneBriefing(zone)
console.log(briefing.freshness)
```

## Notes

- The provider adapters fetch public upstream endpoints directly from Node, not from the browser.
- Some providers are scraped from public pages because no suitable normalized JSON endpoint exists for that part of the workflow.
- If you operate your own deployment, set `EC_PROVIDER_USER_AGENT` so official providers can identify your traffic more clearly.
- Upstream structure can change. If you use the scrapers in production, pin a version and monitor parser regressions.
- If you need a hosted HTTP interface instead of library imports, use the local API routes documented in [api-reference.md](./api-reference.md).

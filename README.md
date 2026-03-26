# Emergency Centre

Emergency Centre is an open-source web app for monitoring real emergency coverage feeds. It is built for storms, flooding, earthquakes, wildfire pressure, air-quality incidents, missing-person bulletins, and other public-safety alerts.

The open-source core is intentionally:

- public
- usable without login
- self-hostable
- feed-driven instead of vendor-locked

[Support ongoing development on Ko-Fi](https://ko-fi.com/ninezel)

## Current product model

Emergency Centre no longer ships with baked-in mock coverage data. Instead, each deployment configures its own coverage areas and feed URLs through the in-app setup surface.

Each configured coverage area includes:

- name
- region
- country
- location codes such as postcodes or ZIP codes
- aliases or address hints for search
- coordinates for the coverage record
- a live JSON briefing endpoint

The app stores that configuration locally in the browser, polls the configured feeds, and renders the normalized weather, hazard, public-briefing, and readiness data.

## Core features

- no mandatory login in the open-source core
- coverage search by postcode, ZIP code, city, district, alias, or code
- coverage directory dropdown
- live polling for configured briefing feeds
- browser sound alerts when new live alerts appear
- metric or imperial display preference
- manual feed refresh and sound test controls
- hazard, weather, public-briefing, source-health, and readiness panels
- local persistence for coverage setup and monitoring preferences

## Feed setup quick start

1. Start the app locally.
2. Open the `Live Alert Setup` section.
3. Add a coverage area with its metadata and briefing feed URL.
4. Make sure the feed returns the JSON shape documented in [docs/feed-schema.md](./docs/feed-schema.md).
5. If the upstream provider needs secrets or blocks browser requests, put a proxy or adapter in front of it.
6. Use `Refresh feeds now` to run the first sync.

## Documentation

- [Architecture notes](./docs/architecture.md)
- [Feature reference](./docs/feature-reference.md)
- [Developer guide](./docs/developer-guide.md)
- [Feed schema](./docs/feed-schema.md)
- [Security model](./docs/security-model.md)
- [Contributing guide](./CONTRIBUTING.md)

## Repository layout

- `src/App.tsx`: top-level application shell and state orchestration
- `src/components/`: overview, coverage, setup, alert, and information panels
- `src/lib/location.ts`: coverage matching, suggestion ranking, and selection helpers
- `src/lib/briefing.ts`: briefing assembly for the selected coverage area
- `src/lib/feed.ts`: live feed fetching and baseline response validation
- `src/lib/setup.ts`: local setup persistence and coverage profile hydration
- `src/lib/alertSync.ts`: live-alert diffing and sync summary helpers
- `src/lib/audio.ts`: browser alert sound playback
- `src/types.ts`: shared frontend contracts
- `src/styles.css`: visual system and responsive layout

## Stack

- React
- TypeScript
- Vite
- Plain CSS

## Getting started

```powershell
cd g:\Projects\emergency-centre
$env:TEMP='g:\Projects\.tmp'
$env:TMP='g:\Projects\.tmp'
$env:npm_config_cache='g:\Projects\.npm-cache'
npm install
npm run dev
```

For a production build:

```powershell
$env:TEMP='g:\Projects\.tmp'
$env:TMP='g:\Projects\.tmp'
$env:npm_config_cache='g:\Projects\.npm-cache'
npm run build
```

## Environment variables

The open-source core currently requires no environment variables.

If you add live providers that need secrets, do not expose those secrets in the public client. Put them behind a server or edge adapter and document that setup separately.

## Open-source scope

Current core:

- public monitoring without accounts
- user-configured coverage areas
- browser-local setup persistence
- live feed polling
- alert sound playback
- replaceable feed providers

Deferred optional modules:

- saved places across devices
- subscriptions and outbound notifications
- moderator or operator workflows
- optional auth-backed personalization

## License

Licensed under `AGPL-3.0-or-later`. See [LICENSE](./LICENSE).

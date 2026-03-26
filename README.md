# Emergency Centre

Emergency Centre is an open-source web application for monitoring live public hazard briefings across configurable coverage areas. It is designed for storms, flooding, earthquakes, wildfire pressure, air-quality incidents, missing-person bulletins, and other public-safety alerts.

The project is intentionally:

- public by default
- self-hostable
- feed-driven rather than vendor-locked
- usable without mandatory login

[Support ongoing development on Ko-Fi](https://ko-fi.com/ninezel)

## What It Does

Emergency Centre lets a deployment define one or more coverage areas and connect each one to a live JSON briefing feed.

Each coverage record includes:

- a public-facing place name
- region and country metadata
- location codes such as postcodes, ZIP codes, or other local code systems
- aliases or address hints for search
- coordinates for the coverage record
- a live briefing endpoint

The application stores that configuration locally in the browser, polls the configured feeds, and renders a public monitoring surface for weather, hazards, public briefings, source health, and readiness actions.

## Core Capabilities

- coverage search by postcode, ZIP code, city, district, alias, or code
- coverage directory dropdown for known supported areas
- live polling for configured briefing feeds
- browser sound alerts when new live alerts appear
- metric or imperial display preference
- built-in setup tutorial and in-app feed-schema reference
- manual feed refresh and sound test controls
- hazard, weather, public-briefing, source-health, and readiness panels
- open-source baseline with no mandatory login

## Operating Model

Emergency Centre does not ship with bundled live alert data.

Instead:

1. A user configures a coverage area in the setup section.
2. The coverage area points to a live JSON briefing endpoint.
3. The browser polls that endpoint on the configured interval.
4. The selected coverage area is rendered into the monitoring interface.
5. Search and directory selection operate only on the configured coverage records.

This keeps the core application generic and self-hostable while allowing each deployment to choose its own trusted data sources.

## Quick Start

```powershell
cd g:\Projects\emergency-centre
$env:TEMP='g:\Projects\.tmp'
$env:TMP='g:\Projects\.tmp'
$env:npm_config_cache='g:\Projects\.npm-cache'
npm install
npm run dev
```

Create a production build with:

```powershell
$env:TEMP='g:\Projects\.tmp'
$env:TMP='g:\Projects\.tmp'
$env:npm_config_cache='g:\Projects\.npm-cache'
npm run build
```

## Feed Requirements

Each coverage area must point to a JSON briefing feed. The minimum required response fields are:

- `outlook`
- `weather`

The recommended full contract is documented in [docs/feed-schema.md](./docs/feed-schema.md).

Important constraints:

- do not expose private API keys in a client-visible feed URL
- use a proxy or edge adapter if the upstream provider needs secrets
- use a proxy if the upstream does not allow browser access
- keep alert IDs stable so new-alert sound detection works correctly

## Documentation

- [Architecture notes](./docs/architecture.md)
- [Feature reference](./docs/feature-reference.md)
- [Developer guide](./docs/developer-guide.md)
- [Feed schema](./docs/feed-schema.md)
- [Security model](./docs/security-model.md)
- [Contributing guide](./CONTRIBUTING.md)

## Repository Layout

- `src/App.tsx`: top-level application shell and state orchestration
- `src/components/`: UI surfaces for overview, coverage selection, setup, alerts, and supporting information
- `src/lib/location.ts`: coverage matching, suggestion ranking, and selection helpers
- `src/lib/briefing.ts`: briefing assembly for the selected coverage area
- `src/lib/feed.ts`: live feed fetching and baseline response validation
- `src/lib/setup.ts`: local setup persistence and coverage profile hydration
- `src/lib/alertSync.ts`: live-alert diffing and sync summary helpers
- `src/lib/audio.ts`: browser alert sound playback
- `src/lib/units.ts`: display-layer unit conversion for weather output
- `src/types.ts`: shared frontend contracts
- `src/styles.css`: visual system and responsive layout

## Environment And Security Notes

The open-source core currently requires no environment variables.

The default baseline also does not require:

- Supabase
- user accounts
- private backend storage

If a live provider needs secrets, keep them out of the public client and document the adapter or proxy layer explicitly.

## Planned Optional Extensions

- saved places across devices
- outbound notifications and subscriptions
- moderator or operator workflows
- optional auth-backed personalization

These are intentionally deferred so the baseline stays simple, public, and easy to self-host.

## License

Licensed under `AGPL-3.0-or-later`. See [LICENSE](./LICENSE).

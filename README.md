# Emergency Centre

Emergency Centre is an open-source public briefing app for storms, flooding, earthquakes, wildfire pressure, air-quality incidents, missing-person bulletins, and civic emergency signals.

The open-source core is intentionally public and location-first:

- no mandatory login
- no mandatory Supabase dependency
- no user account required to inspect local conditions
- designed so self-hosters can swap in their own trusted data providers

[Support ongoing development on Ko-Fi](https://ko-fi.com/ninezel)

## Product direction

Emergency Centre is being repositioned away from a private operator console and toward a public information surface that helps anyone:

- search by postcode, ZIP code, address hint, district, or place
- use autocomplete suggestions from a local coverage directory
- switch between supported coverage areas from a dropdown
- view public hazard signals
- read weather, situation, and public-safety updates
- check source health and trust posture
- see recommended readiness actions

## Why there is no login in the open-source core

The default posture is public access because:

- emergency information should not be gated behind an account wall
- open-source self-hosters should be able to deploy the app without identity infrastructure
- storing user identity and saved locations increases security and privacy obligations
- public read-only access is the safest baseline

Supabase is still a valid future extension for:

- saved places
- subscriptions
- community reports
- role-based moderation

But it is intentionally not required for the first open-source release.

## Documentation

- [Architecture notes](./docs/architecture.md)
- [Feature reference](./docs/feature-reference.md)
- [Developer guide](./docs/developer-guide.md)
- [Security model](./docs/security-model.md)
- [Contributing guide](./CONTRIBUTING.md)

## Repository layout

- `src/App.tsx`: top-level application shell
- `src/components/`: UI sections for coverage search, alert feeds, situation panels, and OSS posture
- `src/data/mockNetwork.ts`: mock hazard/news/weather/source data
- `src/lib/location.ts`: autocomplete matching, directory lookup, and coverage selection helpers
- `src/lib/briefing.ts`: briefing assembly for the selected location
- `src/types.ts`: shared frontend types
- `src/styles.css`: visual system and page styling

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

The current open-source baseline does not require any environment variables.

See [.env.example](./.env.example) for the current placeholder policy. If optional
modules such as accounts or subscriptions are introduced later, they should ship
their own documented variables and setup steps.

## Open-source scope

Current core:

- public read-only hazard briefing experience
- mock provider architecture
- local typeahead coverage search and directory selection
- support for weather, hazard, and public-safety bulletins
- no user accounts

Planned optional modules:

- Supabase-backed saved locations
- subscriptions and notifications
- moderation and operator review workflows
- real provider adapters for weather, flood, seismic, and news sources

## License

Licensed under `AGPL-3.0-or-later`. See [LICENSE](./LICENSE).

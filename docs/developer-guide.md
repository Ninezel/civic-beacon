# Developer Guide

This guide is for contributors working on the Emergency Centre open-source core.

## Local setup

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

## Project layout

- `src/App.tsx`: state orchestration, polling, selection, and top-level composition
- `src/components/`: isolated UI sections
- `src/components/SetupTutorial.tsx`: in-app onboarding for first-time feed setup
- `src/lib/setup.ts`: persisted setup and profile lifecycle helpers
- `src/lib/feed.ts`: live feed fetching
- `src/lib/alertSync.ts`: sync summaries and new-alert detection
- `src/lib/audio.ts`: alert sound playback
- `src/lib/location.ts`: search and selection logic
- `src/lib/briefing.ts`: briefing shaping and summary metrics
- `src/types.ts`: shared frontend contracts
- `src/styles.css`: visual system and responsive layout

## Architectural rules

- Keep the default build public and usable without login.
- Do not introduce private auth or database dependencies into the open-source baseline.
- Treat coverage feeds as replaceable integrations.
- Keep search and selection logic independent from any single provider.
- Make feed health and trust posture visible to users.
- Do not silently mix official data with unverified data.

## Live feed guidance

Each coverage record points to one briefing URL. That endpoint must return the normalized JSON shape documented in [feed-schema.md](./feed-schema.md).

Key rules:

- coverage metadata is configured locally by the user
- live briefing data is fetched from the configured URL
- if an upstream provider needs secrets, use a server or edge adapter
- if the upstream blocks browser access, use a proxy that adds the correct CORS headers
- keep returned data explicit about source provenance

## Local persistence model

The open-source core stores setup in browser local storage. That currently includes:

- configured coverage records
- polling interval
- alert sound preference
- alert volume preference
- unit system preference

Do not treat this as a secure store. It is a convenience layer for local configuration.

## UI guidance

- Empty states must be explicit when no coverage feed is configured.
- Syncing, live, idle, and error states should remain visually distinct.
- Search must keep working for generic location codes, not only UK postcodes.
- Avoid stretching hero copy or overloading the control panel with long paragraphs.

## Verification checklist

Before opening a pull request:

- run `npm run build`
- test the setup flow by adding and removing a coverage feed
- test a successful live refresh
- test a failing feed URL and confirm the error state is visible
- test the sound button in the browser
- confirm mobile layout still works
- update the docs set if behavior changed

## Documentation expectations

When a feature changes, update the relevant docs at the same time:

- `README.md` for product direction or setup changes
- `docs/feature-reference.md` for user-facing behavior
- `docs/architecture.md` for structural changes
- `docs/feed-schema.md` for contract changes
- `docs/security-model.md` for trust, privacy, or auth implications

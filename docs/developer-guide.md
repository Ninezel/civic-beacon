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

- `src/App.tsx`: top-level composition and user interaction flow
- `src/components/`: isolated UI sections
- `src/data/mockNetwork.ts`: local seed dataset for the baseline app
- `src/providers/mockProvider.ts`: provider boundary used by the baseline build
- `src/lib/location.ts`: autocomplete ranking, coverage lookup, and selection helpers
- `src/lib/briefing.ts`: briefing shaping and summary metrics
- `src/types.ts`: shared frontend contracts
- `src/styles.css`: visual system and responsive layout

## Architectural rules

- Keep the default build public and usable without login.
- Do not add identity or private persistence as a hidden dependency.
- Keep location and briefing logic data-source agnostic where practical.
- Treat provider integrations as replaceable modules.
- Make trust posture explicit when rendering third-party or mixed-confidence data.

## Provider integration guidance

The current app uses a local mock provider. Live integrations should preserve the same boundary:

- fetch or assemble coverage profiles outside the UI components
- normalize provider data into the shared `LocationProfile` contract
- include generic location codes rather than UK-only postcode assumptions
- label source provenance clearly
- avoid mixing trusted official data and lower-confidence reports without visible distinction

If a future provider needs secrets, do not wire those secrets into the public client directly. Use a server or edge boundary and document it explicitly.

## Optional auth guidance

Authentication is not part of the open-source baseline. If it is added later:

- place it behind a clearly documented optional module
- separate public read models from private user data
- document every new environment variable
- explain the threat model and moderation responsibilities in `docs/security-model.md`

## Verification checklist

Before opening a pull request:

- run `npm run build`
- review the changed screens in the browser
- confirm mobile layout still works
- check that no new feature blocks public access by default
- update `README.md` and the docs set if behavior changed

## Documentation expectations

When a feature changes, update the relevant docs at the same time:

- `README.md` for product direction or setup changes
- `docs/feature-reference.md` for user-facing behavior
- `docs/architecture.md` for structural changes
- `docs/security-model.md` for trust, privacy, or auth implications

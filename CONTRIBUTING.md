# Contributing

Emergency Centre is an open-source public-good project. Contributions should improve reliability, clarity, trust, accessibility, and security before they improve novelty.

## Before you start

- Read the [README](./README.md).
- Read the [architecture notes](./docs/architecture.md).
- Read the [feature reference](./docs/feature-reference.md) before changing visible behavior.
- Read the [developer guide](./docs/developer-guide.md) before introducing new providers or build-time dependencies.
- Read the [security model](./docs/security-model.md) before adding data collection, providers, or auth.

## Local setup

```powershell
cd g:\Projects\emergency-centre
$env:TEMP='g:\Projects\.tmp'
$env:TMP='g:\Projects\.tmp'
$env:npm_config_cache='g:\Projects\.npm-cache'
npm install
npm run dev
```

## Verification

```powershell
$env:TEMP='g:\Projects\.tmp'
$env:TMP='g:\Projects\.tmp'
$env:npm_config_cache='g:\Projects\.npm-cache'
npm run build
```

## Contribution rules

- keep public access working without a login
- treat Supabase as optional future infrastructure, not a hard dependency
- keep provider integrations replaceable
- document every user-visible behavior change
- explain trust and security tradeoffs in pull requests

## Pull request guidance

- Describe the problem before the implementation.
- Call out data trust, privacy, or abuse implications.
- Include screenshots for interface changes.
- Avoid unrelated refactors in the same change.

## Maintainer support

If the project helps your community, support maintenance here:

- https://ko-fi.com/ninezel

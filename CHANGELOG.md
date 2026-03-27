# Changelog

All notable project-facing changes for Emergency Centre are recorded here.

## v1.0.0 - 2026-03-27

### Added

- a reusable Node library surface under `server/library/` with stable package entrypoints for:
  - built-in coverage catalog lookup
  - direct provider adapter access
  - normalized live briefing generation
  - deterministic demo briefing generation
- package exports for:
  - `emergency-centre`
  - `emergency-centre/catalog`
  - `emergency-centre/providers`
- install and usage documentation for consuming the scrapers and briefing builders from other projects
- tests covering the public library surface and saved starter-route migration

### Changed

- promoted the package, API surface, and docs set to `v1.0.0`
- improved release metadata in `package.json` with repository, bugs, homepage, keywords, and Node engine guidance
- improved saved setup hydration so known built-in starter zones automatically migrate from `/api/briefings/demo/:zoneId` to `/api/briefings/live/:zoneId`
- refined the setup and monitoring UI panels for denser operator workflows and clearer status presentation

### Documentation

- added `docs/node-library.md`
- refreshed the README, developer guide, architecture notes, API reference, feature reference, security notes, and environment example
- added and synced a wiki page for the reusable Node library plus updated release notes for `v1.0.0`

## 2026-03-26

### Added

- modular live-provider adapters under `server/services/providers/` for:
  - `NWS` forecasts and alerts
  - `Met Office` forecast pages and warning RSS feeds
  - `Environment Agency` flood warnings
  - `USGS` earthquake feeds
- a last-known-good briefing snapshot store so live routes can degrade to an explicit stale response instead of hard failing after a previous success
- response-level freshness metadata in the shared briefing contract
- upstream provenance fields for signals, news, and sources:
  - item links
  - source fetch method
  - source fetched-at timestamps
- optional browser notifications for newly arrived live signals
- parser fixtures and `vitest` coverage for provider normalization and stale snapshot behavior
- a repo-level changelog and matching wiki changelog page

### Changed

- starter zone metadata now carries explicit provider configuration in `src/data/coverageCatalogData.ts`
- `server/services/liveBriefingService.ts` now composes provider contributions instead of owning all parsing logic directly
- the client now preserves and renders freshness state during live polling, sync summaries, and selected-location briefings
- source-health and bulletin panels now expose official upstream links when feeds provide them
- the local API now returns `X-EC-Data-State` and tighter cache headers for live briefing routes

### Documentation

- refreshed `README.md`, API/schema docs, architecture notes, developer guidance, feature reference, and security notes for the new provider structure
- documented stale snapshot behavior, freshness fields, provenance fields, notification behavior, and test commands
- synced the tracked `wiki/` source pages and the live GitHub wiki to match the current codebase

### Notes

- demo briefing routes remain available as deterministic local fallbacks
- starter live routes still use allowlisted official providers only; they are not a generic proxy layer

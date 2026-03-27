# Changelog

This page tracks user-facing release notes for Emergency Centre.

## v1.0.0 - 2026-03-27

### Reusable provider library

- added installable Node package entrypoints for built-in catalog lookup, provider adapter access, live briefing generation, and demo briefing generation
- documented GitHub install and import examples so other projects can reuse the scrapers directly
- added tests for the public library surface

### Release polish

- promoted the project metadata and API discovery surface to `v1.0.0`
- improved saved starter-zone migration so old demo routes upgrade automatically to live starter routes
- refreshed the setup and monitoring UI for a cleaner operator workflow
- updated the README, docs set, environment example, and wiki pages to match the release

## 2026-03-26

### Provider reliability pass

- split the built-in live briefing logic into dedicated provider adapters for `NWS`, `Met Office`, `Environment Agency`, and `USGS`
- added stale snapshot fallback so live starter routes can keep serving the last-known-good briefing during upstream refresh failures
- added shared `freshness` metadata and upstream provenance fields to the normalized briefing contract
- exposed official-source links in signals, bulletins, and source audit cards when feeds provide them
- added optional browser notifications for newly arrived live signals
- added parser and snapshot tests to catch upstream payload or markup drift

### Docs and wiki sync

- refreshed the README, API reference, feed schema, architecture notes, developer guide, feature reference, and security notes
- documented stale snapshot behavior, freshness fields, test commands, and notification behavior
- kept the tracked `wiki/` pages and the published GitHub wiki in sync

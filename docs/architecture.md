# Architecture Notes

Emergency Centre is now a public web application, not a private desktop command console.

## Core product decision

The open-source core is intentionally:

- public
- read-only
- location-first
- deployable without identity infrastructure

This means the default app should work without:

- user accounts
- Supabase
- server-side sessions
- stored personal profiles

## Frontend architecture

### `src/App.tsx`

Owns the top-level page state:

- current location query
- selected location
- search status message

It coordinates the main interaction flows:

- search submission
- autocomplete suggestion selection
- coverage directory selection

### `src/data/mockNetwork.ts`

Contains the current mock provider data:

- location coverage profiles
- hazard signals
- weather snapshots
- situation news
- source-health records
- readiness actions

This is the current stand-in for real provider adapters.

### `src/providers/mockProvider.ts`

Defines the current provider contract boundary:

- exposes the coverage profiles used by the UI
- centralizes the default profile selection
- gives future maintainers a clear seam for live integrations

### `src/lib/location.ts`

Responsible for:

- matching search text to known location profiles
- generating ranked autocomplete suggestions
- resolving a selected coverage area from the provider dataset
- creating consistent selection metadata for search and directory flows

The functions in this module are intentionally data-source agnostic. They operate
on an injected profile list rather than importing a global dataset directly.

### `src/lib/briefing.ts`

Builds the final location briefing:

- sorts hazards by severity
- computes summary metrics
- shapes the selected location into a renderable briefing model

### `src/components/`

Each major product surface is split into a focused UI component:

- `LocationConsole`
- `OverviewPanel`
- `AlertFeed`
- `SituationPanels`
- `OpenSourcePanel`

The current UI intentionally avoids a map dependency. Coverage selection is handled through
autocomplete search and a directory dropdown so the open-source core stays simpler to self-host
and easier to verify.

## Why the core has no auth

The project may eventually support user accounts, but the first open-source release does not depend on them.

Reasons:

- public emergency information should not be gated behind signup
- open-source self-hosters should have a safe default deployment path
- identity systems create disproportionate security overhead early
- location search works well as a public interaction model

## Future optional Supabase architecture

If auth is added later, it should be an optional module behind a feature flag.

Recommended future scope:

- saved locations
- notification preferences
- volunteer or moderator dashboards
- community reports with moderation
- role-based editorial workflows

Recommended technical constraints:

- row-level security
- separate public read models from private user data
- explicit moderation state for any user-generated report
- strong audit trails for published alerts

## Data-source posture

The product should keep provider integrations abstract. Self-hosters may not all want the same sources.

Target provider categories:

- weather
- flood and river telemetry
- seismic feeds
- civil or official public notices
- public newsroom updates

The current mock dataset exists to preserve this architecture until real adapters are added.

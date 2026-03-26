# Architecture Notes

Emergency Centre is a public monitoring client for real emergency briefing feeds.

## Core product decision

The open-source core is intentionally:

- public
- feed-driven
- usable without login
- deployable without Supabase
- configurable by local operators or self-hosters

That means the baseline app does not assume:

- user accounts
- private profiles
- server-side sessions
- vendor-managed feed infrastructure

## High-level flow

1. A user configures one or more coverage areas in the setup panel.
2. The setup is saved to browser local storage.
3. Search and directory selection operate on those configured coverage profiles.
4. The app polls each profile's briefing URL on a fixed interval.
5. Feed responses are normalized into the shared `LocationProfile` shape.
6. Display preferences such as unit system are applied in the presentation layer.
7. The selected profile is converted into a renderable briefing model.
8. If new live alerts appear, the browser can play an alert tone.

## Frontend architecture

### `src/App.tsx`

Owns the top-level state:

- persisted setup
- selected coverage record
- query text and autocomplete results
- sync status messaging
- polling lifecycle
- audio alert triggers

It is the coordination layer between setup, selection, feed refresh, and presentation components.

### `src/lib/setup.ts`

Responsible for:

- the local storage key used by the app
- creation of new empty coverage profiles
- hydration of saved profiles from storage
- safe defaults for old or partial data
- merging live feed data into a profile
- setting sync and error states

### `src/lib/feed.ts`

Owns baseline live-feed fetching:

- fetches a briefing URL
- requests JSON
- validates the required top-level fields
- normalizes array-like sections so the UI can render safely

This module is intentionally small. If deployments need stronger validation, they should extend it without leaking secrets into the browser.

### `src/lib/alertSync.ts`

Tracks operational sync behavior:

- compares the previous and next live alert sets
- counts newly arrived live alerts
- creates user-facing sync summaries

### `src/lib/audio.ts`

Provides the browser alert tone. It uses the Web Audio API so the project does not need to ship a bundled media file just to support alert playback.

### `src/lib/location.ts`

Handles coverage lookup and search:

- location-code matches
- alias matches
- place and region matches
- ranked autocomplete suggestions
- consistent selection metadata for directory and search flows

This module is data-source agnostic. It operates on the configured coverage profile list rather than importing a global dataset.

### `src/lib/briefing.ts`

Builds the render-ready briefing:

- sorts hazard items by severity
- calculates headline metrics
- exposes refresh-state messaging for the selected profile

### `src/components/`

The UI is split into focused surfaces:

- `OverviewPanel`
- `LocationConsole`
- `SetupPanel`
- `SetupTutorial`
- `AlertFeed`
- `SituationPanels`
- `OpenSourcePanel`

The product intentionally avoids a built-in map dependency in the current baseline. Coverage monitoring is driven by configured areas, search, and the directory dropdown.

## Trust boundary

Emergency Centre is a public client. Feed URLs and feed responses are visible to the browser.

Implications:

- never place private API keys directly in a client-visible feed URL
- use a proxy or edge adapter for protected upstream providers
- label source provenance clearly in the returned data
- do not make unofficial feeds look identical to official ones

## Future optional modules

The baseline is deliberately narrow. Future modules can add:

- account-backed saved places
- outbound notification channels
- moderation or editorial tooling
- richer provider adapters

Those should stay optional and should not weaken the no-login default deployment path.

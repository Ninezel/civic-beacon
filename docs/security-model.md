# Security Model

This document explains how the current Emergency Centre baseline approaches trust, privacy, and future auth.

## Core rule

The open-source core is public and read-only.

That means:

- no mandatory login
- no personal profile storage
- no private user dashboards
- no Supabase dependency in the default install

## Why this is safer right now

Removing accounts from the first baseline reduces:

- credential theft risk
- session management complexity
- saved-location privacy exposure
- self-hosting mistakes around auth configuration
- accidental collection of personal data

## What still needs security attention

Public apps can still be unsafe. Current priority areas are:

- unsafe rendering of third-party content
- spoofed or misleading public hazard data
- weak provenance labeling
- location-input abuse
- future provider-key leakage

## Trust boundaries

The app should distinguish clearly between:

- official or authoritative data
- newsroom or public reporting
- manually reviewed civic notices
- future community reports

Anything future and user-generated must never look identical to official data.

## Future Supabase guidance

If optional accounts are added later:

- keep them behind a feature flag
- separate public read models from private user tables
- enforce row-level security
- audit every publication and moderation action
- treat saved locations as sensitive personal data

## Current frontend posture

- location selection happens client-side
- autocomplete suggestions come from a local coverage directory
- no identity data is required
- mock provider data is local and static
- no environment secrets are required for the baseline build
- the app can be reviewed and self-hosted without secrets

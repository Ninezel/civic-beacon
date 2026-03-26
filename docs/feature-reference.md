# Feature Reference

This document describes every user-facing feature in the current Emergency Centre web baseline.

## 1. Public access

Purpose:

- allow communities to inspect emergency coverage without an account wall

Current behavior:

- no account required
- no login prompt
- no mandatory Supabase dependency
- no saved cross-device identity workflow in the core app

## 2. Live alert setup

Purpose:

- let each deployment connect real alert feeds instead of relying on bundled demo data

Current inputs:

- coverage name
- region or state
- country
- location codes
- aliases or address hints
- latitude
- longitude
- briefing feed URL

Current behavior:

- setup is stored locally in the browser
- the app can add and remove coverage records
- `Refresh feeds now` forces an immediate sync
- the sound test button plays the current alert tone
- unit display can be switched between metric and imperial

## 3. Coverage search

Purpose:

- let the user switch quickly between configured coverage areas

Current inputs:

- free-text query
- autocomplete suggestions
- coverage directory dropdown

Accepted search examples:

- postcode
- ZIP code
- location code
- city name
- district name
- neighborhood name
- general address hint

Current implementation note:

- search suggestions are generated from configured coverage profiles
- there is no built-in external geocoder in the open-source core

## 4. Coverage sync states

Purpose:

- show whether the selected feed is ready, syncing, live, or failing

Current states:

- waiting for first sync
- syncing live feeds
- live feed
- feed issue

Current behavior:

- feed errors are surfaced directly in the control panel
- successful syncs update the overview metrics and downstream panels

## 5. Polling and manual refresh

Purpose:

- keep the selected coverage areas current

Current behavior:

- polling interval is configurable in the setup panel
- feeds are automatically polled on the selected interval
- the setup panel can force a manual refresh

## 6. Sound alerts

Purpose:

- make newly arrived live alerts harder to miss

Current behavior:

- audio alerts can be enabled or disabled
- alert volume is configurable
- the app compares the previous and next live alert sets
- the browser tone plays when new live alerts arrive after the first successful sync

Current limitation:

- browser autoplay policy can block sound until the user interacts with the page

## 7. Headline overview

Purpose:

- summarize local risk and current monitoring posture in one glance

Current contents:

- configured coverage feed count
- active signal count
- critical signal count
- refresh state
- current selection mode
- last refresh summary

## 8. Hazard feed

Purpose:

- show the active incidents and monitored signals for the selected coverage area

Current card contents:

- title
- source
- issue time
- severity
- category
- summary
- coverage
- hotspot label
- field reaction count

Current categories:

- storm
- flood
- earthquake
- wildfire
- heat
- air quality
- public safety

Public-safety examples may include:

- missing-person bulletins
- search perimeters
- police or civic safety notices

## 9. Weather snapshot

Purpose:

- provide a fast environmental read for the selected coverage area

Current contents:

- condition
- temperature in metric or imperial display
- wind in metric or imperial display
- rain chance
- short advisory text

## 10. Situation news

Purpose:

- surface public briefing headlines around the selected coverage area

Current contents:

- headline
- source
- publish time
- summary
- scope label

## 11. Readiness actions

Purpose:

- show concrete next steps people should take

Current contents:

- action title
- description
- when-to-use guidance

## 12. Source audit

Purpose:

- make source freshness and trust posture visible

Current contents:

- source name
- source type
- source status
- last sync
- operational note

Current statuses:

- Healthy
- Delayed
- Manual review

## 13. Open-source and security panel

Purpose:

- explain the public-access posture of the project inside the product

Current contents:

- no-login explanation
- optional-auth explanation
- replaceable feed-provider explanation
- Ko-Fi support link

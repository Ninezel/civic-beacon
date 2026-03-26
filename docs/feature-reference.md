# Feature Reference

This document describes every user-facing feature in the current Emergency Centre web baseline.

## 1. Public access

Purpose:

- allow anyone to inspect local conditions immediately

Current behavior:

- no account required
- no login prompt
- no saved profile workflow

## 2. Location console

Purpose:

- let the user choose an area quickly

Current inputs:

- free-text query
- autocomplete suggestions
- coverage directory dropdown

Accepted search style examples:

- postcode
- ZIP code
- location code
- city name
- neighborhood name
- general address hint

Current implementation note:

- search suggestions come from the local mock coverage directory rather than a live geocoder
- the matching logic operates on provider-supplied coverage profiles rather than a hard-coded UI dependency

## 3. Coverage directory selection

Purpose:

- provide a stable fallback when the user prefers a known supported area list

Current behavior:

- a select menu lists every available coverage profile
- choosing an item updates the full briefing immediately
- the selected coverage area also updates the search field context

Current limitation:

- the baseline ships with a mock coverage directory, not live address autocomplete or GIS data

## 4. Headline overview

Purpose:

- summarize local risk in one glance

Current contents:

- active signal count
- critical signal count
- location confidence mode
- refresh status

## 5. Hazard feed

Purpose:

- show the actual incidents and monitored signals for the selected location

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

## 6. Weather snapshot

Purpose:

- provide a fast environmental read for the selected location

Current contents:

- condition
- temperature
- wind
- rain chance
- short advisory text

## 7. Situation news

Purpose:

- surface public briefing headlines around the selected location

Current contents:

- headline
- source
- publish time
- summary
- scope label

## 8. Readiness actions

Purpose:

- show concrete next steps people should take

Current contents:

- action title
- description
- when-to-use guidance

## 9. Source audit

Purpose:

- make trust posture visible

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

## 10. Open-source and security panel

Purpose:

- explain the public-access posture of the project inside the product

Current contents:

- no-login explanation
- optional Supabase explanation
- provider abstraction explanation
- support / Ko-Fi link

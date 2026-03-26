# Emergency Centre Wiki

Emergency Centre is an open-source multi-signal monitoring platform with:

- a public-first React frontend
- built-in UK and US starter coverage zones
- postcode and ZIP lookup
- an optional local Node API for catalog and demo briefing routes

Project links:

- Repository: https://github.com/Ninezel/emergency-centre
- Ko-Fi: https://ko-fi.com/ninezel

## Start Here

- Read the main repository `README.md`
- Review the API routes in `docs/api-reference.md`
- Review the feed contract in `docs/feed-schema.md`
- Review the security posture in `docs/security-model.md`

## Core Concepts

- `Coverage area`: a named monitoring zone with codes, aliases, coordinates, and a briefing URL
- `Signals`: normalized weather, transport, infrastructure, public-safety, or other monitoring items
- `Starter directory`: a built-in catalog for supported countries that helps bootstrap setup
- `Demo API`: a local endpoint set that makes the starter zones runnable without a third-party feed on day one

## Main Pages

- [[API Services]]
- [[Coverage Zones]]
- [[Self Hosting]]
- [[Security Model]]

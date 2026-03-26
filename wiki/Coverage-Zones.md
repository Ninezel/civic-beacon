# Coverage Zones

Emergency Centre currently ships with a starter directory for:

- `United Kingdom`
- `United States`

Users can bootstrap a coverage record in two ways:

1. select `country -> region/state -> coverage area`
2. search by UK postcode or US ZIP code

## Starter Flow

When a starter zone is loaded into the setup form, Emergency Centre fills:

- coverage name
- region
- country
- aliases
- location codes
- coordinates

If the feed URL field is empty, it also fills a local demo API endpoint:

- `/api/briefings/demo/:zoneId`

## Important Limitation

The starter directory is curated, not exhaustive.

That means:

- it is a bootstrap system, not a global geocoder
- self-hosters can still add manual coverage records
- future expansions can add more countries and deeper regional coverage

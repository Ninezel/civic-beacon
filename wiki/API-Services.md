# API Services

Emergency Centre includes an optional Node API server.

Default local origin:

- `http://localhost:8787`

## Endpoints

- `GET /api`
- `GET /api/health`
- `GET /api/catalog/countries`
- `GET /api/catalog/regions?country=GB`
- `GET /api/catalog/zones?country=GB&region=greater-london`
- `GET /api/catalog/lookup?q=SW1A%201AA&country=GB`
- `GET /api/catalog/zones/:zoneId`
- `GET /api/briefings/demo/:zoneId`

## What The API Does

- exposes the built-in starter catalog in a service-friendly format
- lets clients look up starter zones by country, region, postcode, or ZIP
- serves demo briefings so the UI can run end to end before a real upstream provider is connected

## What The API Does Not Do

- it does not implement user auth
- it does not implement persistence
- it does not implement a generic open proxy
- it does not manage secrets for arbitrary third-party providers

## Development

Run frontend and API together:

```powershell
$env:TEMP='g:\Projects\.tmp'
$env:TMP='g:\Projects\.tmp'
$env:npm_config_cache='g:\Projects\.npm-cache'
npm install
npm run dev
```

Run only the API:

```powershell
$env:TEMP='g:\Projects\.tmp'
$env:TMP='g:\Projects\.tmp'
$env:npm_config_cache='g:\Projects\.npm-cache'
npm run dev:api
```

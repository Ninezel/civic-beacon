# Self Hosting

Emergency Centre can be run as:

- a frontend-only deployment
- a frontend plus the optional local API service

## Local Development

```powershell
cd g:\Projects\emergency-centre
$env:TEMP='g:\Projects\.tmp'
$env:TMP='g:\Projects\.tmp'
$env:npm_config_cache='g:\Projects\.npm-cache'
npm install
npm run dev
```

This starts:

- the Vite frontend
- the Node API server

## Production Build

```powershell
$env:TEMP='g:\Projects\.tmp'
$env:TMP='g:\Projects\.tmp'
$env:npm_config_cache='g:\Projects\.npm-cache'
npm run build
```

Run the API server:

```powershell
node dist-server/index.js
```

## Environment

Optional variables:

- `EC_API_PORT`
- `EC_API_ORIGIN`

See `.env.example` in the repository root.

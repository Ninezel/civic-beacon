# Security Model

Emergency Centre is public by default and does not require accounts in the open-source baseline.

## Browser Layer

The browser stores local setup such as:

- configured coverage records
- polling interval
- sound preference
- unit preference

Do not store secrets in browser local storage.

## API Layer

The local API service is intentionally narrow.

Current posture:

- explicit catalog routes only
- explicit demo briefing routes only
- no generic open proxy
- no account storage

If future server-side fetch routes are added, they should be allowlisted and documented clearly.

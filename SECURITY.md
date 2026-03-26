# Security Policy

Emergency Centre is a public hazard briefing app. Security work here is not only about code execution risks; it is also about misinformation, privacy, trust boundaries, and safe defaults.

## Current security posture

The open-source core intentionally avoids a login system. That reduces:

- credential handling risk
- account takeover risk
- personal data retention
- saved-location privacy risk
- self-hosting complexity

This does not remove security work. It shifts the priority toward:

- safe handling of location input
- trustworthy provider integration
- moderation of public signals
- protection against misleading or spoofed alerts

## Reporting a vulnerability

Please do not open a public issue for security-sensitive problems.

Use a private contact route through the project hosting platform. If no private route is available, use the maintainer support link and clearly mark the message as a security report:

- https://ko-fi.com/ninezel

Include:

- affected commit or branch
- reproduction steps
- impact
- provider or input conditions needed to trigger the issue

## Priority areas

- spoofed or misleading public hazard signals
- location privacy leaks
- unsafe third-party provider handling
- script injection through location or news content
- insecure future auth or Supabase integrations
- broken trust indicators that make unverified data look official

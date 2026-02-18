# Trust Plugin

Security and compliance checks. OWASP Top 10, GDPR, secrets, auth verification.

## Install

**Local testing**:

```bash
claude --plugin-dir ./plugins/trust
```

**From a marketplace**: `/plugin install trust@superskills`

**Cowork**: zip this folder and upload from the Cowork Plugins tab (click "+", drag zip, "Upload").

## Commands

| Command | What It Does |
|---------|-------------|
| `/trust:init` | Set up auth flow, RLS policies, CORS, security headers. |
| `/trust:audit` | Full OWASP Top 10 + GDPR compliance audit. |

## Skills

- **security** (automatic): Blocks on credentials in code, injection, XSS, auth bypass, PII exposure.

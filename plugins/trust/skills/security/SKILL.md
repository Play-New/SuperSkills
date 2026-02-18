---
name: security
description: Proactive security checks for OWASP Top 10, GDPR, secrets, and auth
---

# Security

Proactive security checks for every code change.

## When This Activates

Automatically when writing or editing code, especially API routes, auth logic, database queries, and configuration files.

## Blocking Rules

Blocks on these five conditions:
1. **Credentials in code** — API keys, passwords, tokens hardcoded
2. **SQL injection** — Unsanitized user input in queries
3. **XSS** — Unescaped user content rendered as HTML
4. **Auth bypass** — Missing auth checks on protected routes
5. **PII exposure** — Personal data logged, in errors, or in URLs

## Tool-Specific Best Practices

### Supabase
- RLS enabled on ALL tables
- Service role key NEVER exposed to the client
- Auth middleware on protected API routes
- No raw SQL queries — use query builder or stored procedures

### Vercel
- No secrets in vercel.json or next.config.ts
- Environment variables split: Preview vs Production
- Security headers configured

### Inngest
- Event signing key validated
- No PII in event payloads
- Step functions idempotent

### Next.js
- Server Actions validate input
- API routes check auth before processing
- Dynamic routes validate params
- Image domains restricted

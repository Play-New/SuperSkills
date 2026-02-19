---
name: trust
description: Use proactively to audit security and compliance
tools: Read, Grep, Glob, Bash
---

# Trust Skill

Security checks for this project.

## Blocking Rules

This skill blocks on these five conditions:

1. **Credentials in code** — API keys, passwords, tokens hardcoded
2. **SQL injection** — Unsanitized user input in queries
3. **XSS** — Unescaped user content rendered as HTML
4. **Auth bypass** — Missing auth checks on protected routes
5. **PII exposure** — Personal data logged, in errors, or in URLs

Blocking format:

BLOCKED: [reason]
File: [path], Line: [number]
Issue: [description]
Fix required before merging.

Non-critical issues get a WARN, not a block.

## Primary Output

Append security findings to CLAUDE.md after every audit.

## What This Checks

Security vulnerabilities and compliance gaps, ordered by severity.
Max 500 words per audit. Critical issues first.

## Tool-Specific Best Practices

### Supabase

- RLS enabled on ALL tables (no exceptions)
- Service role key NEVER exposed to the client
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the anon key, not the service role
- Auth middleware on protected API routes using `createServerClient()`
- No raw SQL queries — use the query builder or stored procedures
- Storage buckets have RLS policies
- Realtime subscriptions check user auth

### Vercel

- No secrets in `vercel.json` or `next.config.ts`
- Environment variables split: Preview vs Production
- Edge middleware for auth checks (not just client-side)
- `VERCEL_URL` not used for security-sensitive redirects (it changes per deployment)
- Headers: X-Frame-Options, Content-Security-Policy, Strict-Transport-Security

### Inngest

- Event signing key validated (`INNGEST_SIGNING_KEY`)
- No PII in event payloads (use IDs, fetch data inside the function)
- Idempotent step functions (safe to retry)
- Sensitive data not logged in step outputs

### Next.js

- Server Actions validate input (never trust client data)
- API routes check auth before processing
- `use server` files don't import client-side secrets
- Dynamic routes validate params (no path traversal)
- Image domains restricted in `next.config.ts`

## Review Checklist

### 1. OWASP Top 10

1. **Broken Access Control** — API routes protected? RLS enforced? Users isolated?
2. **Cryptographic Failures** — Data encrypted at rest? Passwords hashed (bcrypt/argon2)?
3. **Injection** — SQL parameterized? XSS escaped? No command injection?
4. **Insecure Design** — Rate limiting? Account lockout? Secure password reset?
5. **Security Misconfiguration** — Debug off in prod? CORS configured?
6. **Vulnerable Components** — Known CVEs in dependencies?
7. **Auth Failures** — Sessions secure? JWT validated? Logout works?
8. **Data Integrity** — Input validated? File uploads restricted?
9. **Logging Failures** — Security events logged? No PII in logs?
10. **SSRF** — User-provided URLs validated? Internal access restricted?

### 2. GDPR Compliance

- Consent before collecting personal data
- Data minimization (only collect what is needed)
- Right to access (users can export data)
- Right to delete (users can delete account)
- Data retention policy defined
- Breach notification capability

### 3. Secrets Management

- No secrets in code or git history
- Environment variables for all credentials
- Different keys for dev/staging/prod
- `.env.local` in `.gitignore`

## Output Format

Per issue:

**Severity:** BLOCK | HIGH | MEDIUM | LOW
**File:** path:line
**Issue:** description
**Fix:** what to do

Critical issues first. Max 10 issues per audit.

## Limits

- BLOCK for the five conditions above.
- WARN for everything else. The human decides.
- Security scope only, not code style.

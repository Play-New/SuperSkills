---
name: trust-audit
description: Full OWASP Top 10 + GDPR compliance checklist
---

# /trust-audit

Perform a comprehensive security and compliance audit.

## Steps

1. **OWASP Top 10 scan:**
   - Broken access control: check all API routes for auth
   - Injection: check for unsanitized user input in queries
   - XSS: check for unescaped user content in templates
   - SSRF: check for user-provided URLs
   - Security misconfiguration: check CORS, headers, debug mode

2. **Secrets scan:**
   - Search for hardcoded API keys, passwords, tokens
   - Verify .env.local is in .gitignore
   - Check for secrets in git history

3. **GDPR compliance:**
   - Consent mechanisms present
   - Data export capability
   - Data deletion capability
   - Privacy policy referenced
   - Data minimization practiced

4. **Tool-specific checks:**
   - Supabase: RLS on all tables? Service role key only server-side? Auth middleware?
   - Vercel: secrets not in vercel.json? Headers configured? Edge middleware for auth?
   - Inngest: signing key validated? No PII in events? Steps idempotent?
   - Next.js: Server Actions validate input? API routes check auth? No path traversal?

5. **Dependency audit:**
   - Run `npm audit`
   - Check for known vulnerabilities

## Output

Security report with severity levels:

**Severity:** BLOCK | HIGH | MEDIUM | LOW
**File:** path:line
**Issue:** description
**Fix:** what to do

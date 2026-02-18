---
description: Full OWASP Top 10 + GDPR security audit
argument-hint: "[optional: specific files or areas to audit]"
---

# /trust:audit

Comprehensive security and compliance audit.

## Steps

1. **OWASP Top 10 scan**: access control, injection, XSS, SSRF, misconfiguration
2. **Secrets scan**: hardcoded keys, .gitignore check, git history
3. **GDPR compliance**: consent, export, deletion, minimization
4. **Tool-specific checks**:
   - Supabase: RLS on all tables? Service role server-only? Auth middleware?
   - Vercel: no secrets in config? Headers? Edge middleware?
   - Inngest: signing key? No PII in events? Idempotent steps?
   - Next.js: Server Actions validate input? API routes check auth?
5. **Dependency audit**: `npm audit`

## Blocking Conditions

Blocks on: credentials in code, SQL injection, XSS, auth bypass, PII exposure.

## Output

**Severity:** BLOCK | HIGH | MEDIUM | LOW
**File:** path:line
**Issue:** description
**Fix:** what to do

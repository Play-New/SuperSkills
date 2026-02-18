---
description: Set up security foundations (auth, RLS, CORS, headers)
argument-hint: "[optional: auth method, data sensitivity level]"
---

# /trust:init

Set up security foundations for this project.

## Steps

1. Ask about authentication requirements:
   - Auth method: Supabase Auth (email/password, OAuth, magic link)
   - Protected routes
   - Role-based access

2. Configure Supabase RLS:
   - Enable RLS on all tables
   - Create initial policies
   - Service role key server-side only

3. Ask about data sensitivity:
   - PII fields to protect
   - GDPR requirements (consent, export, deletion)

4. Configure security headers in `next.config.ts`:
   - X-Frame-Options, X-Content-Type-Options
   - Strict-Transport-Security
   - Referrer-Policy

5. Set up environment variable validation at startup

## Tool-Specific Setup

- **Supabase**: RLS policies, auth middleware, no service key on client
- **Vercel**: env var split (Preview vs Production), edge middleware
- **Inngest**: signing key validation, no PII in events
- **Next.js**: Server Action input validation, API route auth checks

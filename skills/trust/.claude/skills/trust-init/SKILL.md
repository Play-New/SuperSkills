---
name: trust-init
description: Configure auth flow, RLS policies, CORS, and data sensitivity levels
---

# /trust-init

Set up security foundations for this project.

## Steps

1. Ask the user about authentication requirements:
   - Auth method: Supabase Auth (email/password, OAuth, magic link)
   - Protected routes: which pages require auth
   - Role-based access: admin, user, etc.

2. Configure Supabase Row Level Security (RLS):
   - Create initial RLS policies for main tables
   - Enable RLS on all tables by default
   - Create helper functions for auth checks

3. Ask about data sensitivity:
   - PII fields to protect
   - Data retention requirements
   - GDPR requirements (consent, export, deletion)

4. Configure CORS:
   - Allowed origins for production
   - API route protection middleware

5. Set up environment variable validation:
   - Verify all required env vars are set at startup

6. Security headers in `next.config.ts`:
   ```typescript
   headers: async () => [{
     source: '/(.*)',
     headers: [
       { key: 'X-Frame-Options', value: 'DENY' },
       { key: 'X-Content-Type-Options', value: 'nosniff' },
       { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
       { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
     ],
   }]
   ```

## Tool-Specific Setup

### Supabase
- Enable RLS on every table: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Create policies: `CREATE POLICY "Users can only see their own data" ON table_name FOR SELECT USING (auth.uid() = user_id);`
- Never use service role key on the client

### Vercel
- Split env vars between Preview and Production
- Set up edge middleware for auth

### Inngest
- Validate `INNGEST_SIGNING_KEY` in the serve endpoint
- No PII in event payloads

## Output

- Supabase migration with RLS policies
- Auth middleware for Next.js
- Environment variable validation
- Security headers configured

---
description: Set up vitest + Playwright testing infrastructure
argument-hint: "[optional: critical user flows to test]"
---

# /testing-init

Set up the testing infrastructure.

## Steps

1. Install: `npm install -D vitest @playwright/test`
2. Configure vitest (vitest.config.ts or package.json)
3. Configure Playwright: `npx playwright install`
4. Set up directory structure: `tests/unit/`, `tests/e2e/`
5. Ask for critical test scenarios
6. Write first smoke tests (unit + E2E)
7. Tool-specific setup:
   - **Supabase**: mock client, test RLS with roles
   - **Inngest**: `inngest/test` for step functions
   - **Next.js**: mock NextRequest for API routes
8. Run tests to verify: `npm test` and `npx playwright test`

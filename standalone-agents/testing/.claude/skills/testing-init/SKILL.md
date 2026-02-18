---
name: testing-init
description: Set up vitest + Playwright, define critical scenarios, write first smoke test
---

# /testing-init

Set up the testing infrastructure.

## Steps

1. Configure vitest:
   - Verify vitest config in package.json or vitest.config.ts
   - Set up test directory structure: `tests/unit/`, `tests/e2e/`
   - Add test scripts to package.json:
     ```json
     {
       "test": "vitest run",
       "test:watch": "vitest",
       "test:e2e": "npx playwright test"
     }
     ```

2. Configure Playwright:
   - Run `npx playwright install`
   - Create playwright.config.ts with local dev server
   - Set up base URL for local development

3. Install dependencies:
   ```bash
   npm install -D vitest @playwright/test
   ```

4. Ask the user for critical test scenarios:
   - What are the most important user flows?
   - What must never break?

5. Write first tests:
   - Unit smoke test: verify core utilities work
   - E2E smoke test: verify home page loads and renders

6. Tool-specific test setup:
   - **Supabase**: mock client for unit tests, test RLS with different roles
   - **Inngest**: use `inngest/test` for step function testing
   - **Next.js**: mock `NextRequest` for API route tests

7. Run tests to verify setup:
   - `npm test` for vitest
   - `npx playwright test` for E2E

## Output

- vitest configured and running
- Playwright configured with sample E2E test
- Critical scenarios documented

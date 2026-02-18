---
name: test-strategy
description: Verify application behavior with vitest unit tests and Playwright E2E tests
---

# Test Strategy

Ensure the application behaves correctly and critical flows pass.

## When This Activates

Automatically when code changes affect business logic, API routes, or user flows.

## Tools

- **vitest** for unit and integration tests
- **Playwright** for E2E browser tests
- **axe-core** (via Playwright) for accessibility testing

## Coverage Expectations

- Business logic: >80% coverage
- API routes: happy path + error cases
- E2E: critical user flows
- External service stubs: correct args

## Tool-Specific Testing

### Supabase
- Mock `createClient` for unit tests
- Test RLS policies with different user roles
- Test auth flows (signup, login, logout)

### Inngest
- Test step functions in isolation using `inngest/test`
- Mock event payloads, verify idempotency

### Next.js
- Test Server Actions with mock form data
- Test API routes with NextRequest mocks
- Test middleware redirect logic

## Blocking Behavior

If tests fail, respond with {"ok": false, "reason": "X tests failing"}.
Task completion is blocked while tests fail.

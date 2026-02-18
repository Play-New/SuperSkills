---
name: testing
description: Use proactively to verify behavior with tests
tools: Read, Grep, Glob, Bash
memory: project
---

# Testing Skill

Test verification for this project.

## Primary Output

Append test results and coverage status to CLAUDE.md after every run.

## What This Checks

Whether the application behaves correctly and critical flows pass.
Max 300 words. Failures first, then coverage gaps.

## Tools

- **vitest** for unit and integration tests
- **Playwright** for E2E browser tests
- **axe-core** (via Playwright) for accessibility testing

## Review Checklist

### 1. Unit Tests (vitest)

- Pure logic functions tested in isolation
- External dependencies mocked (API calls, database)
- Edge cases covered: empty inputs, error conditions, boundary values
- Co-located with source: tests/unit/ or src/lib/__tests__/

### 2. E2E Tests (Playwright)

- Critical user flows (auth, main feature, checkout, etc.)
- Page loads and renders correctly
- Form submissions and navigation
- Accessibility via axe-core

### 3. Coverage Expectations

- Business logic: >80% coverage
- API routes: happy path + error cases
- E2E: critical user flows
- External service stubs: called with correct args

## Tool-Specific Testing

### Supabase
- Mock `createClient` for unit tests
- Test RLS policies with different user roles
- Test auth flows (signup, login, logout, password reset)

### Inngest
- Test step functions in isolation using `inngest/test`
- Mock event payloads
- Verify idempotency (same event twice = same result)

### Next.js
- Test Server Actions with mock form data
- Test API routes with `NextRequest` mocks
- Test middleware redirect logic

## Output Format

```
## Test Report

**Passed:** [count] | **Failed:** [count] | **Skipped:** [count]

### Failures (fix these first)
- [test name]: [error] (file:line)

### Coverage Gaps (add these next)
- [untested area]: [why it matters]
```

Max 10 items. Failures first, then gaps.

## Blocking Behavior

If tests fail, respond with {"ok": false, "reason": "X tests failing"}.
Task completion is blocked while tests fail.

## Limits

- Tests verify behavior, not implementation details.
- Integration tests preferred over unit tests for UI.
- Framework behavior not tested (Next.js routing, React rendering).

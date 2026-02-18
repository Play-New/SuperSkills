---
description: Run full test suite and report results
argument-hint: "[optional: specific test files or patterns]"
---

# /testing:verify

Run the complete test suite and report results.

## Steps

1. Unit tests: `npm test -- --run`
2. E2E tests: `npx playwright test`
3. Type checking: `npx tsc --noEmit`
4. Report: passed / failed / skipped with file paths
5. If tests fail, do NOT mark task as complete

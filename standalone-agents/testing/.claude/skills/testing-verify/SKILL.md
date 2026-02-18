---
name: testing-verify
description: Run full test suite and report failures
---

# /testing-verify

Run the complete test suite and report results.

## Steps

1. Run unit tests:
   ```bash
   npm test -- --run
   ```

2. Run E2E tests (if Playwright is configured):
   ```bash
   npx playwright test
   ```

3. Run type checking:
   ```bash
   npx tsc --noEmit
   ```

4. Report results:
   - Total tests: passed / failed / skipped
   - Failed test details with file paths
   - Type errors with file paths
   - Suggestions for fixing failures

5. If any tests fail, do NOT mark the task as complete.

## Output

Test report with pass/fail counts.

# Testing Plugin

Test setup and verification with vitest and Playwright.

## Install

**Local testing**:

```bash
claude --plugin-dir ./plugins/testing
```

**From a marketplace**: `/plugin install testing@superskills`

**Cowork**: zip this folder and upload from the Cowork Plugins tab (click "+", drag zip, "Upload").

## Commands

| Command | What It Does |
|---------|-------------|
| `/testing:init` | Set up vitest + Playwright, define critical scenarios, write first smoke test. |
| `/testing:verify` | Run full test suite, report failures. Blocks if tests fail. |

## Skills

- **test-strategy** (automatic): Verifies application behavior. Blocks task completion while tests fail.

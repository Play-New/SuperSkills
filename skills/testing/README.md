# Testing Skill (Standalone)

Test setup and verification with vitest and Playwright. Includes tool-specific testing patterns for Supabase, Inngest, and Next.js.

## Install

```bash
cp -r skills/testing/.claude/ your-project/.claude/
```

Open the project in Claude Code. The commands work immediately.

## Commands

| Command | When | What It Does |
|---------|------|-------------|
| `/testing-init` | Once | Sets up vitest + Playwright, defines critical scenarios, writes first smoke test |
| `/testing-verify` | Any time | Runs full test suite, reports failures |

## Blocking Behavior

Testing blocks task completion while tests fail. If `/testing-verify` finds failures, it responds with `{"ok": false}` and the task stays open until tests pass.

## Prerequisites

Needs Node.js 20+. `/testing-init` installs vitest and Playwright. If the project has a CLAUDE.md with an EIID mapping (from `/strategy-start`), the testing skill defines critical flows based on the EIID layers.

## Subagent

The testing subagent (`.claude/agents/testing.md`) activates automatically to verify behavior. Blocks stop if tests fail.

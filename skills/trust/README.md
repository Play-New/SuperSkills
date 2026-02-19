# Trust Skill (Standalone)

Security and compliance checks. OWASP Top 10, GDPR, secrets scanning, auth verification. Includes best practices for Supabase, Vercel, Inngest, and Next.js.

## Install

```bash
cp -r skills/trust/.claude/ your-project/.claude/
```

Open the project in Claude Code. The commands work immediately.

## Commands

| Command | When | What It Does |
|---------|------|-------------|
| `/trust-init` | Once | Sets up auth flow, RLS policies, CORS, security headers |
| `/trust-audit` | Any time | Full OWASP Top 10 + GDPR compliance audit |

## Blocking Conditions

Trust is the only skill that blocks on findings. Five conditions:

1. Credentials in code
2. SQL injection
3. XSS
4. Auth bypass
5. PII exposure

Everything else gets a warning.

## Prerequisites

Works with any project. If the project has a CLAUDE.md with an EIID mapping (from `/strategy-start`), audits will check data handling against the declared sensitivity level.

## Subagent

The trust subagent (`.claude/agents/trust.md`) activates automatically when editing code. It blocks dangerous patterns before they land.

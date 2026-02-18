---
name: strategy-start
description: Define a project from scratch. Maps the business problem to the EIID framework and writes CLAUDE.md.
---

# /strategy-start

Start a new project or define the strategic foundation for an existing one. This is the entry point for any SuperSkills project.

No API key needed. No CLI. Claude Code does the analysis directly.

## Before Starting

1. Read the codebase. Check for:
   - `CLAUDE.md` (if it exists and has an EIID mapping, stop and suggest `/strategy-init` instead)
   - `package.json`, `README.md`, existing source files
   - `.env.example` or `.env.local` for configured services
2. If files exist, use them as context. Do not ask questions the code already answers.

## Conversation (not a form)

Have a short conversation to understand the project. Adapt to what you already know from reading the codebase.

Ask about what you do not know. Skip what you can infer. The four things you need:

1. **The problem.** What costs time, money, or attention today? Be specific: "4 hours/day on manual order entry" not "improve efficiency".
2. **The data.** What systems, APIs, files, or data sources exist? Gmail, ERP, CRM, spreadsheets, databases, external APIs, public data.
3. **The people.** Who needs the output? Where are they? (email, Slack, WhatsApp, Telegram, dashboard, mobile)
4. **The outcome.** What does success look like in concrete terms?

Do NOT ask all four if the codebase or the user's first message already covers some. One round of questions is ideal. Two at most.

## EIID Mapping

From the conversation, build the four-layer mapping:

### Enrichment
- What data exists today (list concrete sources)
- What data is missing but available (public APIs, partner data, user behavior)
- What data sources to connect

### Inference
- What patterns to detect (be specific: "orders that deviate >20% from historical average")
- What predictions to make
- What anomalies to flag

### Interpretation
- What insights to surface (not raw data, not dashboards: actionable statements)
- How to frame them (comparison, trend, explanation, recommendation)

### Delivery
- Which channels (email, Slack, WhatsApp, Telegram, SMS, Discord, dashboard)
- What triggers each delivery (threshold crossed, schedule, event, user request)
- Timing: when is the insight most valuable?

## Write CLAUDE.md

Create or update CLAUDE.md with this structure:

```markdown
# [Project Name]

## Context

**For:** [who]
**Business:** [what they do]
**Industry:** [sector]

## Problem

[The specific problem, quantified if possible]

## Desired Outcome

[What success looks like]

## AI-Native Architecture (EIID)

### Enrichment

**Existing Data:**
- [source 1]
- [source 2]

**Missing Data:**
- [what could be added]

**Sources:**
- [systems to connect]

### Inference

**Patterns to Detect:**
- [pattern 1]

**Predictions:**
- [prediction 1]

**Anomalies:**
- [anomaly 1]

### Interpretation

**Insights to Generate:**
- [insight 1]

### Delivery

**Channels:**
- [channel 1]

**Triggers:**
- [trigger 1]

## Architecture Decisions

<!-- strategy-review appends decisions here -->

### [today's date] - Project Defined

**Type:** decision
**Summary:** Initial EIID mapping created via /strategy-start.
**Recommendation:** Run /strategy-init to validate and prioritize.
```

## Suggest Next Steps

After writing CLAUDE.md, tell the user:

1. **Run `/strategy-init`** to validate the mapping and set priorities
2. **Suggest skills based on the project:**
   - Has UI? -> "Install the design skill for shadcn/shadcnblocks setup: `/design-init`"
   - Handles user data? -> "Install the trust skill for security and GDPR: `/trust-init`"
   - Has tests or needs them? -> "Install the testing skill: `/testing-init`"
   - Has external APIs or heavy dependencies? -> "Install the efficiency skill: `/efficiency-init`"
3. **If the user wants the full scaffold** (Next.js + Supabase + Inngest project structure): `npx superskills scaffold --json --discovery discovery.json --output ./` — offer to create the discovery.json from the EIID mapping.

## Rules

- One conversation, then write. Do not iterate endlessly.
- Write concrete items, not vague categories. "Gmail inbox" not "email data".
- If something is uncertain, write it with a question mark and move on. The user can refine later.
- CLAUDE.md is the deliverable. Everything else is secondary.
- Do not suggest tools or tech stack. That is the scaffold's job, or the user's choice.

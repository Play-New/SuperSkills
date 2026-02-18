---
description: Define a project from scratch. Maps business problem to EIID framework, writes CLAUDE.md.
argument-hint: "[optional: describe your business problem]"
---

# /strategy:start

Start a new project or define the strategic foundation for an existing one.

No API key needed. No CLI. Claude Code does the analysis directly.

## Before Starting

1. Read the codebase: CLAUDE.md, package.json, README.md, source files, .env.example
2. If CLAUDE.md already has an EIID mapping, suggest `/strategy:init` instead
3. Use existing files as context. Do not ask what the code already tells you.

## Conversation

Ask about what you do not know. Skip what you can infer. Four things needed:

1. **The problem.** What costs time, money, or attention today?
2. **The data.** What systems, APIs, files, data sources exist?
3. **The people.** Who needs the output? Where are they? (email, Slack, WhatsApp, Telegram)
4. **The outcome.** What does success look like?

One round of questions. Two at most.

## EIID Mapping

Build the four-layer mapping from the conversation:

- **Enrichment**: existing data, missing data, sources to connect
- **Inference**: patterns to detect, predictions, anomalies to flag
- **Interpretation**: actionable insights to surface
- **Delivery**: channels, triggers, timing

## Output

Write CLAUDE.md with: Context, Problem, Desired Outcome, EIID mapping, empty Architecture Decisions section.

Then suggest next steps: `/strategy:init` to validate, plus which other skills to install based on the project needs.

## Rules

- One conversation, then write. Do not iterate endlessly.
- Concrete items, not vague categories. "Gmail inbox" not "email data".
- CLAUDE.md is the deliverable.
- Do not suggest tools or tech stack.

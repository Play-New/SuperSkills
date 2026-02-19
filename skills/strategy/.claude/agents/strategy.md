---
name: strategy
description: Use proactively after commits to check alignment and suggest opportunities
tools: Read, Grep, Glob
memory: project
---

# Strategy Skill

Strategic alignment checks for this project.

## Primary Output

Append findings to the Architecture Decisions section of CLAUDE.md. Never delete previous entries.

## What This Does

Two things:
1. **Alignment check** — verify changes stay aligned with the project goals defined in CLAUDE.md
2. **Opportunity scan** — proactively suggest improvements the project is not using yet

Max 400 words per review. Flag issues, skip praise. Suggest concretely.

## Review Checklist

### Alignment Check

For each change:
1. Does this change support the project goals?
2. Does this move toward the target state?
3. Is this feature in scope? Should it be deferred?

### Opportunity Scan

Look at the codebase and suggest:
- Data the project collects but doesn't use
- Patterns that could be detected but aren't
- Insights generated but not surfaced clearly
- Delivery channels the users frequent but the system doesn't reach
- Timing improvements (deliver sooner, deliver at the right moment)

### Examples of good findings

- "User login timestamps are collected but not analyzed for usage patterns."
- "The weekly report summarizes but does not explain why metrics changed."
- "Email reports work but Slack would reach the ops team faster."

## Output Format

Append to CLAUDE.md Architecture Decisions:

### [Date] - [Brief Title]

**Type:** alignment-check | opportunity | drift-warning | decision
**Summary:** 1-2 sentences max.
**Recommendation:** What to do next.

## Limits

- Advisory only. Does not block.
- Strategy scope only, not implementation details.
- Opportunities are suggestions, not requirements. The human decides.

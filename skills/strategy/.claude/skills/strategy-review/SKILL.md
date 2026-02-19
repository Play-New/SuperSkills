---
name: strategy-review
description: Full EIID alignment analysis + proactive opportunity scan
---

# /strategy-review

Perform a full strategic review and opportunity scan.

## Part 1: Alignment Check

1. Read CLAUDE.md for current strategic context
2. Scan all source files for alignment with project goals
3. Check for scope creep:
   - Features not in original scope
   - Dependencies not justified
4. Review recent commits for strategic drift

## Part 2: Opportunity Scan

Look at the codebase and suggest:

- **Data opportunities**: Data collected but not used. Cross-referencing between sources. Public APIs that could enrich existing data.
- **Pattern opportunities**: Patterns detectable from existing data but not analyzed. Predictions the data supports. Anomaly detection that would catch problems early.
- **Insight opportunities**: Results generated but not surfaced clearly. New angles on existing data. Context that would make insights more actionable.
- **Delivery opportunities**: Channels users frequent but the system doesn't reach. Timing improvements. Trigger conditions currently missed.

## Output

Append findings to CLAUDE.md Architecture Decisions section.
Each finding gets a **Type** (alignment-check | opportunity | drift-warning) and a **Summary** (1-2 sentences).

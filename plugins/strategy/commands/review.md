---
description: Alignment check + opportunity scan
argument-hint: "[optional: recent changes to review]"
---

# /strategy:review

Full strategic review and opportunity scan.

## Part 1: Alignment Check

1. Read CLAUDE.md for current goals
2. Scan source files for alignment
3. Check for scope creep: features not in scope, unjustified dependencies
4. Review recent commits for drift

## Part 2: Opportunity Scan

Suggest improvements the project is not using:

- **Data**: collected but not used, cross-referencing, public APIs
- **Patterns**: detectable but not analyzed, predictions, anomaly detection
- **Insights**: generated but not surfaced, new angles, context
- **Delivery**: channels not reached, timing, triggers

## Output

**Type:** alignment-check | opportunity | drift-warning
**Summary:** 1-2 sentences
**Recommendation:** What to do next

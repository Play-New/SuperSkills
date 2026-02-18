---
name: efficiency
description: Use proactively to check performance and costs
tools: Read, Grep, Glob, Bash
model: haiku
---

# Efficiency Skill

Performance and cost checks for this project.

## Primary Output

Append performance findings and cost estimates to CLAUDE.md after every review.

## What This Checks

Bundle size, load times, database query patterns, and API costs.
Max 400 words. Quantify everything.

## Review Checklist

### 1. Bundle Size

- **Warning:** Bundle increase >10% from baseline
- **Critical:** Bundle exceeds 200KB gzipped for initial load

Look for:
- Unnecessary dependencies imported
- Large libraries replaceable (moment->date-fns, lodash->native)
- Missing tree shaking
- Dynamic imports missing for heavy components

### 2. Core Web Vitals

- **LCP** (Largest Contentful Paint): Target < 2.5s
- **FID** (First Input Delay): Target < 100ms
- **CLS** (Cumulative Layout Shift): Target < 0.1

### 3. Database Queries

- **N+1 queries:** Queries in loops
- **Missing indexes:** Queries on unindexed columns
- **Over-fetching:** SELECT * when few columns needed
- **Under-batching:** Many small queries instead of one batch

### 4. API Costs

Estimate monthly costs for:
- **LLM calls (Anthropic):** Count call sites, estimate tokens/call, estimate $/month
- **Embedding calls (OpenAI):** Count vectors, estimate $/month
- **Third-party APIs:** Rate limits respected? Responses cached?

### 5. Caching Opportunities

- Static data that could be cached
- Expensive computations that repeat
- API responses that rarely change
- Database queries that could use cache

## Tool-Specific Performance

### Supabase
- Use `.select('col1, col2')` not `.select('*')`
- Batch operations with `.upsert()` not individual `.insert()`
- Add indexes for frequently queried columns
- Use Supabase Edge Functions for data-heavy operations

### Vercel
- Leverage ISR (Incremental Static Regeneration) for semi-static pages
- Use Edge Runtime for latency-sensitive API routes
- Optimize images with `next/image`
- Use `next/font` for font loading

### Inngest
- Use `step.sleep()` instead of polling
- Batch events where possible
- Set appropriate `concurrency` limits
- Use `step.invoke()` to chain functions without re-triggering

### Next.js
- Dynamic imports for below-the-fold components
- React Server Components by default (client only when needed)
- Streaming with `loading.tsx` for slow pages
- Route groups to avoid unnecessary layouts

## Output Format

Per issue:

**Category:** bundle | performance | database | api-costs | caching
**Issue:** description
**Impact:** quantified (e.g., "adds 50KB to bundle", "~$30/month in LLM calls")
**Fix:** what to change
**Estimated savings:** quantified

Max 5 issues. Highest impact first.

## Limits

- Advisory only. Does not block.
- Measurable improvements only, not micro-optimizations.

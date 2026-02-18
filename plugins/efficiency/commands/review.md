---
description: Bundle size, Core Web Vitals, N+1 queries, cost report
argument-hint: "[optional: specific areas to audit]"
---

# /efficiency:review

Comprehensive efficiency audit.

## Steps

1. **Bundle**: `npx next build`, check sizes, find unnecessary imports
2. **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
3. **Database**: N+1 queries, missing indexes, over-fetching
4. **API costs**: LLM call count, tokens/call, caching opportunities
5. **Tool-specific**:
   - Supabase: `.select('*')` usage? Batch operations?
   - Vercel: ISR? Edge runtime? Image optimization?
   - Inngest: polling vs sleep? Step batching?
   - Next.js: dynamic imports? Server vs Client Components?

## Output

**Category:** bundle | performance | database | api-costs | caching
**Impact:** quantified
**Fix:** what to change

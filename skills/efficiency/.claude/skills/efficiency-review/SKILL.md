---
name: efficiency-review
description: Bundle size, Core Web Vitals, N+1 queries, and cost report
---

# /efficiency-review

Perform a comprehensive efficiency audit.

## Steps

1. **Bundle analysis:**
   - Run `npx next build` and check output sizes
   - Identify largest dependencies
   - Check for unnecessary imports

2. **Core Web Vitals:**
   - Check LCP: largest content paint targets
   - Check CLS: layout shift sources
   - Check FID: main thread blocking

3. **Database queries:**
   - Search for N+1 patterns (queries in loops)
   - Check for missing indexes
   - Verify batch operations where possible

4. **API cost estimate:**
   - Count LLM call sites
   - Estimate tokens per call
   - Check for caching opportunities

5. **Tool-specific checks:**
   - Supabase: `.select('*')` usage? Missing indexes? Batch operations?
   - Vercel: ISR configured? Edge runtime for API routes? Image optimization?
   - Inngest: Polling vs sleep? Concurrency limits? Step batching?
   - Next.js: Dynamic imports? Server vs Client Components? Streaming?

6. **Caching opportunities:**
   - Static data that could be cached
   - Repeated API calls
   - Expensive computations

## Output

Per issue:

**Category:** bundle | performance | database | api-costs | caching
**Issue:** description
**Impact:** quantified
**Fix:** what to change

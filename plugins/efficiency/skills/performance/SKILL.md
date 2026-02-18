---
name: performance
description: Check bundle size, Core Web Vitals, N+1 queries, and API costs
---

# Performance

Proactive performance and cost checks.

## When This Activates

Automatically when adding dependencies, writing database queries, or making API calls.

## Thresholds

- Bundle > 200KB gzipped: critical
- LCP > 2.5s: warning
- N+1 queries: always flag

## Tool-Specific Optimization

### Supabase
- `.select('col1, col2')` not `.select('*')`
- Batch with `.upsert()` not individual `.insert()`
- Add indexes for frequent queries
- Edge Functions for data-heavy operations

### Vercel
- ISR for semi-static pages
- Edge Runtime for latency-sensitive routes
- `next/image` for images, `next/font` for fonts

### Inngest
- `step.sleep()` not polling
- Batch events, set `concurrency` limits
- `step.invoke()` to chain functions

### Next.js
- Dynamic imports for below-the-fold components
- Server Components by default
- Streaming with `loading.tsx`

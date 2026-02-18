---
name: design-review
description: Audit shadcnblocks/shadcn usage, hard rule violations, a11y, responsive
---

# /design-review

Audit the UI against the five hard rules, accessibility, and responsive design.

## Hard Rule Violations (check first)

Scan ALL component files (`src/app/**/*.tsx`, `src/components/**/*.tsx`) for:

1. **shadcnblocks FIRST**: Is there a UI section that could be replaced by a shadcnblocks block? (hero, pricing, dashboard, auth, settings, e-commerce, features, testimonials, FAQ, footer, navbar, sidebar, stats, CTA, contact, blog, 404)
2. **shadcn base SECOND**: Is there a custom component that duplicates shadcn functionality?
3. **No custom CSS classes**: Search for className strings containing custom class names (not Tailwind utilities)
4. **Token compliance**: Search for hardcoded hex (#xxx), rgb(), hsl() values in component files. These must come from CSS variables.
5. **No arbitrary values**: Search for Tailwind arbitrary value syntax: `-\[.*\]` in className strings

## Accessibility (WCAG 2.1 AA)

- Color contrast ratios (4.5:1 normal text, 3:1 large text)
- Keyboard navigation (focus states, tab order)
- Screen reader compatibility (semantic HTML, ARIA)
- Touch targets (44x44px minimum)
- Alt text on images
- Labels on form inputs

## Responsive

- Verify mobile layout (320px minimum)
- Check breakpoint consistency (sm/md/lg/xl)

## Output

Per issue:

**File:** path/to/file.tsx:line
**Rule Violated:** Rule [1-5] or a11y or responsive
**Issue:** Brief description
**Fix:** What to change (include exact shadcn/shadcnblocks command if applicable)

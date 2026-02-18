---
description: Audit UI against hard rules, accessibility, and responsive design
argument-hint: "[optional: specific files or components to review]"
---

# /design-review

Audit the UI against the five hard rules, accessibility, and responsive design.

## Hard Rule Violations (check first)

Scan ALL component files for:

1. **shadcnblocks FIRST**: Is there a UI section replaceable by a shadcnblocks block?
2. **shadcn base SECOND**: Custom component duplicating shadcn functionality?
3. **No custom CSS classes**: className containing custom class names (not Tailwind utilities)?
4. **Token compliance**: Hardcoded hex, rgb(), hsl() in component files?
5. **No arbitrary values**: Tailwind arbitrary syntax `-\[.*\]` in className?

## Accessibility (WCAG 2.1 AA)

- Color contrast >= 4.5:1 normal, 3:1 large
- Focus states on interactive elements
- Alt text on images, labels on inputs
- Touch targets >= 44x44px

## Responsive

- Works at 320px minimum
- Breakpoints consistent (sm/md/lg/xl)

## Output

Per issue:

**File:** path:line
**Rule Violated:** Rule [1-5] or a11y or responsive
**Issue:** Brief description
**Fix:** What to change (include shadcn/shadcnblocks command if applicable)

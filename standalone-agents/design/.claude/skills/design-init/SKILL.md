---
name: design-init
description: Configure brand, shadcn/shadcnblocks, design tokens, and SHADCNBLOCKS_API_KEY
---

# /design-init

Set up the design system for this project. Uses shadcnblocks (1351 blocks) and shadcn base components.

## Steps

1. **SHADCNBLOCKS_API_KEY** (optional, only for pro blocks):
   - Most blocks are FREE and work without a key
   - If the user has a pro key: save to `.env.local` as SHADCNBLOCKS_API_KEY
   - If not: continue normally — free blocks cover most use cases

2. **Set up components.json** with the shadcnblocks registry:
   ```json
   {
     "$schema": "https://ui.shadcn.com/schema.json",
     "style": "default",
     "rsc": true,
     "tsx": true,
     "tailwind": {
       "config": "tailwind.config.ts",
       "css": "src/app/globals.css",
       "baseColor": "neutral",
       "cssVariables": true
     },
     "aliases": {
       "components": "@/components",
       "utils": "@/lib/utils",
       "ui": "@/components/ui",
       "lib": "@/lib",
       "hooks": "@/hooks"
     },
     "registries": {
       "@shadcnblocks": {
         "url": "https://shadcnblocks.com/r",
         "headers": {
           "Authorization": "Bearer ${SHADCNBLOCKS_API_KEY}"
         }
       }
     }
   }
   ```

3. **Ask the user for brand assets:**
   - Color palette (primary, secondary, accent, destructive) in HSL
   - Font family (sans, mono)
   - Logo path (if available)

4. **Set up global design tokens** in `src/app/globals.css`:
   - CSS custom properties for ALL colors in HSL format:
     --background, --foreground, --card, --card-foreground, --popover, --popover-foreground,
     --primary, --primary-foreground, --secondary, --secondary-foreground, --muted,
     --muted-foreground, --accent, --accent-foreground, --destructive, --destructive-foreground,
     --border, --input, --ring, --radius
   - Both :root (light) and .dark (dark) variants
   - NO hardcoded hex or rgb anywhere in the file

5. **Configure tailwind.config.ts** to extend from CSS variables:
   - colors read from var(--primary), var(--secondary), etc.
   - borderRadius reads from var(--radius)
   - fontFamily from user choices

6. **Create the cn() utility** in `src/lib/utils.ts`:
   ```typescript
   import { type ClassValue, clsx } from 'clsx';
   import { twMerge } from 'tailwind-merge';

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```
   Install: `npm install clsx tailwind-merge`

7. **Initialize shadcn**: `npx shadcn init`

8. **Install base shadcn components**:
   ```bash
   npx shadcn add button card input label badge dialog dropdown-menu table
   ```

9. **Ask about shadcnblocks layouts** to install:
   - Dashboard: `npx shadcn add @shadcnblocks/sidebar10`
   - Auth pages: `npx shadcn add @shadcnblocks/login1`
   - Settings: `npx shadcn add @shadcnblocks/settings1`
   - Hero: `npx shadcn add @shadcnblocks/hero125`
   - Pricing: `npx shadcn add @shadcnblocks/pricing3`
   Install what the user selects.

## HARD RULES (enforce from day one)

- **shadcnblocks FIRST**: If a block exists for the use case, use it
- **shadcn base SECOND**: Standard components for everything else
- **NEVER custom CSS classes**: No .my-card, no .custom-header
- **ZERO inline arbitrary values**: No text-[#FF5733], no p-[13px]
- **All colors from tokens**: Components read from CSS variables via Tailwind theme

## Output

- `components.json` with shadcnblocks registry
- `src/app/globals.css` with full token set
- `tailwind.config.ts` extending from tokens
- `src/lib/utils.ts` with cn() utility
- shadcn components and blocks installed

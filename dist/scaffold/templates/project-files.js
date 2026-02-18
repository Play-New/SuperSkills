export async function generateProjectFiles(discovery, _tools) {
    const files = {};
    // TypeScript config
    files['tsconfig.json'] = JSON.stringify({
        "compilerOptions": {
            "target": "ES2022",
            "lib": ["dom", "dom.iterable", "ES2022"],
            "allowJs": true,
            "skipLibCheck": true,
            "strict": true,
            "noEmit": true,
            "esModuleInterop": true,
            "module": "esnext",
            "moduleResolution": "bundler",
            "resolveJsonModule": true,
            "isolatedModules": true,
            "jsx": "preserve",
            "incremental": true,
            "plugins": [{ "name": "next" }],
            "paths": { "@/*": ["./src/*"] }
        },
        "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        "exclude": ["node_modules"]
    }, null, 2);
    // Next.js config
    files['next.config.ts'] = `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // AI-native app config
};

export default nextConfig;
`;
    // Tailwind config
    files['tailwind.config.ts'] = `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
`;
    // shadcn components.json with shadcnblocks registry
    files['components.json'] = JSON.stringify({
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
    }, null, 2);
    // PostCSS config
    files['postcss.config.mjs'] = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
`;
    // App layout
    files['src/app/layout.tsx'] = `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${discovery.projectName}',
  description: '${discovery.desiredOutcome}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
    // Global styles
    files['src/app/globals.css'] = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
    // Home page
    files['src/app/page.tsx'] = `export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">${discovery.projectName}</h1>
      <p className="text-gray-600 mb-8">${discovery.desiredOutcome}</p>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">Enrichment</h2>
          <p className="text-sm text-gray-500">
            ${discovery.eiidMapping.enrichment.existingData.slice(0, 2).join(', ')}
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">Inference</h2>
          <p className="text-sm text-gray-500">
            ${discovery.eiidMapping.inference.patterns.slice(0, 2).join(', ')}
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">Interpretation</h2>
          <p className="text-sm text-gray-500">
            ${discovery.eiidMapping.interpretation.insights.slice(0, 2).join(', ')}
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">Delivery</h2>
          <p className="text-sm text-gray-500">
            ${discovery.eiidMapping.delivery.channels.join(', ')}
          </p>
        </div>
      </div>
    </main>
  );
}
`;
    // Supabase client
    files['src/lib/supabase.ts'] = `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role
export function createServerClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
`;
    // AI client
    files['src/lib/ai.ts'] = `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const MODEL = process.env.SUPERSKILLS_MODEL || 'claude-opus-4-6';

export async function generateInsight(prompt: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const textContent = response.content.find(c => c.type === 'text');
  return textContent?.type === 'text' ? textContent.text : '';
}
`;
    // Inngest client
    files['src/inngest/client.ts'] = `import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: '${slugify(discovery.projectName)}',
});
`;
    // Sample Inngest function
    const triggers = discovery.eiidMapping.delivery.triggers;
    files['src/inngest/functions/analyze.ts'] = `import { inngest } from '../client';
import { generateInsight } from '@/lib/ai';

// Triggered by: ${triggers.join(', ') || 'events'}
export const analyzeAndDeliver = inngest.createFunction(
  { id: 'analyze-and-deliver' },
  { event: 'app/data.received' },
  async ({ event, step }) => {
    // Step 1: Analyze data
    const insight = await step.run('generate-insight', async () => {
      return generateInsight(\`
        Analyze this data and provide actionable insights:
        \${JSON.stringify(event.data)}
      \`);
    });

    // Step 2: Decide if notification needed
    const shouldNotify = await step.run('decide-notification', async () => {
      // Add your decision logic here
      return insight.length > 0;
    });

    // Step 3: Deliver to user
    if (shouldNotify) {
      await step.run('deliver-notification', async () => {
        // Delivery channels: ${discovery.eiidMapping.delivery.channels.join(', ')}
        console.log('Delivering insight:', insight);
        // TODO: Implement delivery via Brevo/Telegram/Slack
      });
    }

    return { success: true, insight };
  }
);
`;
    // Inngest route
    files['src/app/api/inngest/route.ts'] = `import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { analyzeAndDeliver } from '@/inngest/functions/analyze';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [analyzeAndDeliver],
});
`;
    // Delivery stub
    const channels = discovery.eiidMapping.delivery.channels;
    files['src/lib/delivery/index.ts'] = `// Delivery channels: ${channels.join(', ')}

export interface DeliveryMessage {
  channel: 'email' | 'sms' | 'whatsapp' | 'telegram' | 'slack' | 'discord';
  recipient: string;
  subject?: string;
  body: string;
}

export async function deliver(message: DeliveryMessage): Promise<boolean> {
  switch (message.channel) {
    case 'email':
    case 'sms':
    case 'whatsapp':
      return deliverViaBrevo(message);
    case 'telegram':
      return deliverViaTelegram(message);
    case 'slack':
      return deliverViaSlack(message);
    case 'discord':
      return deliverViaDiscord(message);
    default:
      throw new Error(\`Unknown channel: \${message.channel}\`);
  }
}

async function deliverViaBrevo(message: DeliveryMessage): Promise<boolean> {
  // TODO: Implement Brevo delivery
  console.log('Brevo delivery:', message);
  return true;
}

async function deliverViaTelegram(message: DeliveryMessage): Promise<boolean> {
  // TODO: Implement Telegram delivery
  console.log('Telegram delivery:', message);
  return true;
}

async function deliverViaSlack(message: DeliveryMessage): Promise<boolean> {
  // TODO: Implement Slack delivery
  console.log('Slack delivery:', message);
  return true;
}

async function deliverViaDiscord(message: DeliveryMessage): Promise<boolean> {
  // TODO: Implement Discord delivery
  console.log('Discord delivery:', message);
  return true;
}
`;
    // Supabase migrations folder
    files['supabase/migrations/.gitkeep'] = '';
    // Supabase config
    files['supabase/config.toml'] = `[project]
id = "${slugify(discovery.projectName)}"
name = "${discovery.projectName}"
`;
    // Playwright config
    files['playwright.config.ts'] = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
`;
    // Sample E2E smoke test
    files['tests/e2e/smoke.spec.ts'] = `import { test, expect } from '@playwright/test';

test('home page loads and displays project name', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('${discovery.projectName}');
});

test('home page shows EIID sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Enrichment')).toBeVisible();
  await expect(page.locator('text=Inference')).toBeVisible();
  await expect(page.locator('text=Interpretation')).toBeVisible();
  await expect(page.locator('text=Delivery')).toBeVisible();
});
`;
    return files;
}
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
//# sourceMappingURL=project-files.js.map
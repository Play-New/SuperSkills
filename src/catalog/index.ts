import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import type { DiscoveryResult } from '../discovery/types.js';
import type { Tool, ToolsCatalog, ToolSuggestion, SelectionResult } from './types.js';

export type { Tool, ToolsCatalog, ToolSuggestion, SelectionResult } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.resolve(__dirname, 'tools-catalog.json');

let catalogCache: ToolsCatalog | null = null;

export async function loadCatalog(): Promise<ToolsCatalog> {
  if (catalogCache) return catalogCache;
  catalogCache = await fs.readJSON(CATALOG_PATH);
  return catalogCache!;
}

export function getTool(catalog: ToolsCatalog, id: string): Tool | undefined {
  return catalog.tools.find(t => t.id === id);
}

export function getToolsByCategory(catalog: ToolsCatalog, category: Tool['category']): Tool[] {
  return catalog.tools.filter(t => t.category === category);
}

export async function selectTools(discoveryResult: DiscoveryResult): Promise<SelectionResult> {
  const catalog = await loadCatalog();
  const suggestions: ToolSuggestion[] = [];

  // Core tools are always included
  const coreTools = getToolsByCategory(catalog, 'core');
  for (const tool of coreTools) {
    suggestions.push({
      tool,
      reason: 'Core infrastructure for AI-native apps',
      required: true
    });
  }

  // Analyze delivery channels from EIID mapping
  const deliveryChannels = discoveryResult.eiidMapping.delivery.channels
    .map(c => c.toLowerCase());

  const deliverySuggestions = selectDeliveryTools(catalog, deliveryChannels);
  suggestions.push(...deliverySuggestions);

  // Analyze data sources for enrichment
  const dataSources = [
    ...discoveryResult.availableData,
    ...discoveryResult.eiidMapping.enrichment.sources
  ].map(s => s.toLowerCase());

  const enrichmentSuggestions = selectEnrichmentTools(catalog, dataSources);
  suggestions.push(...enrichmentSuggestions);

  // Always include Playwright for testing (also usable for enrichment scraping)
  const playwright = getTool(catalog, 'playwright');
  if (playwright) {
    suggestions.push({
      tool: playwright,
      reason: 'E2E testing, accessibility auditing, and browser-based scraping',
      required: true
    });
  }

  // Group by category
  return {
    core: suggestions.filter(s => s.tool.category === 'core'),
    delivery: suggestions.filter(s => s.tool.category === 'delivery' || s.tool.category === 'community'),
    enrichment: suggestions.filter(s => s.tool.category === 'enrichment'),
    testing: suggestions.filter(s => s.tool.category === 'testing'),
    all: suggestions
  };
}

function selectDeliveryTools(catalog: ToolsCatalog, channels: string[]): ToolSuggestion[] {
  const suggestions: ToolSuggestion[] = [];
  const addedIds = new Set<string>();

  const channelMapping: Record<string, { toolId: string; reason: string }[]> = {
    email: [{ toolId: 'brevo', reason: 'Email delivery via Brevo' }],
    sms: [{ toolId: 'brevo', reason: 'SMS delivery via Brevo' }],
    whatsapp: [
      { toolId: 'brevo', reason: 'WhatsApp Business API via Brevo (official)' },
      { toolId: 'baileys', reason: 'WhatsApp personal via Baileys (dev/testing only)' }
    ],
    telegram: [{ toolId: 'telegram', reason: 'Telegram bot notifications' }],
    slack: [{ toolId: 'slack', reason: 'Slack channel notifications' }],
    discord: [{ toolId: 'discord', reason: 'Discord bot notifications' }]
  };

  for (const channel of channels) {
    // Normalize channel name
    const normalizedChannel = normalizeChannel(channel);
    const mappings = channelMapping[normalizedChannel];

    if (mappings) {
      for (const mapping of mappings) {
        if (!addedIds.has(mapping.toolId)) {
          const tool = getTool(catalog, mapping.toolId);
          if (tool) {
            suggestions.push({
              tool,
              reason: mapping.reason,
              required: !tool.optional && !tool.risk
            });
            addedIds.add(mapping.toolId);
          }
        }
      }
    }
  }

  // If no delivery tools selected but channels mentioned, add Brevo as default
  if (suggestions.length === 0 && channels.length > 0) {
    const brevo = getTool(catalog, 'brevo');
    if (brevo) {
      suggestions.push({
        tool: brevo,
        reason: 'Default delivery tool for email notifications',
        required: true
      });
    }
  }

  return suggestions;
}

function selectEnrichmentTools(catalog: ToolsCatalog, dataSources: string[]): ToolSuggestion[] {
  const suggestions: ToolSuggestion[] = [];
  const addedIds = new Set<string>();

  // Check for scraping needs
  const scrapingKeywords = ['web', 'scrape', 'crawl', 'website', 'portal', 'external'];
  const needsScraping = dataSources.some(source =>
    scrapingKeywords.some(kw => source.includes(kw))
  );

  if (needsScraping) {
    const apify = getTool(catalog, 'apify');
    if (apify && !addedIds.has('apify')) {
      suggestions.push({
        tool: apify,
        reason: 'Web scraping for external data sources',
        required: false
      });
      addedIds.add('apify');
    }
  }

  // Check for memory/RAG needs
  const memoryKeywords = ['drive', 'notion', 'onedrive', 'documents', 'files'];
  const needsMemory = dataSources.some(source =>
    memoryKeywords.some(kw => source.includes(kw))
  );

  if (needsMemory) {
    const supermemory = getTool(catalog, 'supermemory');
    if (supermemory && !addedIds.has('supermemory')) {
      suggestions.push({
        tool: supermemory,
        reason: 'Memory API with connectors for Google Drive, Notion, OneDrive',
        required: false
      });
      addedIds.add('supermemory');
    }
  }

  return suggestions;
}

function normalizeChannel(channel: string): string {
  const normalized = channel.toLowerCase().trim();

  // Handle common variations
  if (normalized.includes('email') || normalized.includes('mail')) return 'email';
  if (normalized.includes('whatsapp') || normalized.includes('wa')) return 'whatsapp';
  if (normalized.includes('telegram') || normalized.includes('tg')) return 'telegram';
  if (normalized.includes('slack')) return 'slack';
  if (normalized.includes('discord')) return 'discord';
  if (normalized.includes('sms') || normalized.includes('text')) return 'sms';

  return normalized;
}

export function formatToolsForDisplay(result: SelectionResult): string {
  const lines: string[] = [];

  lines.push('CORE (always included):');
  for (const s of result.core) {
    lines.push(`  - ${s.tool.name}: ${s.tool.description}`);
  }

  if (result.delivery.length > 0) {
    lines.push('\nDELIVERY:');
    for (const s of result.delivery) {
      const note = s.tool.risk ? ` [${s.tool.risk}]` : '';
      lines.push(`  - ${s.tool.name}: ${s.reason}${note}`);
    }
  }

  if (result.enrichment.length > 0) {
    lines.push('\nENRICHMENT:');
    for (const s of result.enrichment) {
      lines.push(`  - ${s.tool.name}: ${s.reason}`);
    }
  }

  if (result.testing.length > 0) {
    lines.push('\nTESTING:');
    for (const s of result.testing) {
      lines.push(`  - ${s.tool.name}: ${s.reason}`);
    }
  }

  return lines.join('\n');
}

export function getEnvVars(result: SelectionResult): string[] {
  const envVars = new Set<string>();
  for (const s of result.all) {
    for (const envVar of s.tool.envVars) {
      envVars.add(envVar);
    }
  }
  return Array.from(envVars).sort();
}

export function getSdkPackages(result: SelectionResult): string[] {
  const packages: string[] = [];
  for (const s of result.all) {
    if (s.tool.sdk) {
      packages.push(s.tool.sdk);
    }
  }
  return packages;
}

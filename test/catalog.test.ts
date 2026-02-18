import { describe, it, expect } from 'vitest';
import { selectTools, loadCatalog, getSdkPackages, getEnvVars } from '../src/catalog/index.js';
import type { DiscoveryResult } from '../src/discovery/types.js';

const createMockDiscovery = (overrides: Partial<DiscoveryResult> = {}): DiscoveryResult => ({
  projectName: 'Test Project',
  problem: 'Test problem',
  desiredOutcome: 'Test outcome',
  context: {
    forWhom: 'me',
    businessDescription: 'Test business'
  },
  currentProcess: [],
  availableData: [],
  strategicAnalysis: {
    industryContext: '',
    valueMovement: '',
    currentPosition: '',
    targetPosition: '',
    opportunities: []
  },
  eiidMapping: {
    enrichment: { existingData: [], missingData: [], sources: [] },
    inference: { patterns: [], predictions: [], anomalies: [] },
    interpretation: { insights: [] },
    delivery: { channels: ['email'], triggers: [] }
  },
  createdAt: new Date().toISOString(),
  ...overrides
});

describe('loadCatalog', () => {
  it('loads tools catalog with all categories', async () => {
    const catalog = await loadCatalog();

    expect(catalog.tools).toBeDefined();
    expect(catalog.tools.length).toBeGreaterThan(0);

    const categories = [...new Set(catalog.tools.map(t => t.category))];
    expect(categories).toContain('core');
    expect(categories).toContain('delivery');
  });

  it('includes required core tools', async () => {
    const catalog = await loadCatalog();
    const coreIds = catalog.tools.filter(t => t.category === 'core').map(t => t.id);

    expect(coreIds).toContain('supabase');
    expect(coreIds).toContain('vercel');
    expect(coreIds).toContain('inngest');
  });
});

describe('selectTools', () => {
  it('always selects core tools', async () => {
    const discovery = createMockDiscovery();
    const selection = await selectTools(discovery);

    expect(selection.core.length).toBeGreaterThan(0);
    expect(selection.core.every(s => s.required)).toBe(true);
  });

  it('selects brevo for email channel', async () => {
    const discovery = createMockDiscovery({
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: [] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
    delivery: { channels: ['email'], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    const deliveryIds = selection.delivery.map(s => s.tool.id);

    expect(deliveryIds).toContain('brevo');
  });

  it('selects slack for slack channel', async () => {
    const discovery = createMockDiscovery({
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: [] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: ['slack'], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    const deliveryIds = selection.delivery.map(s => s.tool.id);

    expect(deliveryIds).toContain('slack');
  });

  it('selects telegram for telegram channel', async () => {
    const discovery = createMockDiscovery({
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: [] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: ['telegram'], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    const deliveryIds = selection.delivery.map(s => s.tool.id);

    expect(deliveryIds).toContain('telegram');
  });

  it('selects discord for discord channel', async () => {
    const discovery = createMockDiscovery({
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: [] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: ['discord'], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    const deliveryIds = selection.delivery.map(s => s.tool.id);

    expect(deliveryIds).toContain('discord');
  });

  it('selects whatsapp tools for whatsapp channel', async () => {
    const discovery = createMockDiscovery({
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: [] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: ['whatsapp'], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    const deliveryIds = selection.delivery.map(s => s.tool.id);

    expect(deliveryIds.some(id => id === 'brevo' || id === 'baileys')).toBe(true);
  });

  it('combines all selections in all array', async () => {
    const discovery = createMockDiscovery();
    const selection = await selectTools(discovery);

    const total = selection.core.length + selection.delivery.length + selection.enrichment.length + selection.testing.length;
    expect(selection.all.length).toBe(total);
  });
});

describe('getSdkPackages', () => {
  it('returns SDK package names for selected tools', async () => {
    const discovery = createMockDiscovery();
    const selection = await selectTools(discovery);
    const packages = getSdkPackages(selection);

    expect(packages).toContain('@supabase/supabase-js');
    expect(packages).toContain('inngest');
  });

  it('excludes tools without SDK', async () => {
    const discovery = createMockDiscovery();
    const selection = await selectTools(discovery);
    const packages = getSdkPackages(selection);

    expect(packages.every(p => p !== null)).toBe(true);
  });
});

describe('getEnvVars', () => {
  it('returns environment variables for selected tools', async () => {
    const discovery = createMockDiscovery();
    const selection = await selectTools(discovery);
    const envVars = getEnvVars(selection);

    expect(envVars).toContain('SUPABASE_URL');
    expect(envVars).toContain('ANTHROPIC_API_KEY');
  });
});

// Edge cases
describe('selectTools edge cases', () => {
  it('handles empty delivery channels', async () => {
    const discovery = createMockDiscovery({
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: [] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: [], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    expect(selection.delivery).toHaveLength(0);
  });

  it('handles unknown channels gracefully', async () => {
    const discovery = createMockDiscovery({
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: [] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: ['carrier_pigeon'], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    // Unknown channel triggers brevo as default fallback
    const deliveryIds = selection.delivery.map(s => s.tool.id);
    expect(deliveryIds).toContain('brevo');
  });

  it('deduplicates tools across channels', async () => {
    const discovery = createMockDiscovery({
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: [] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: ['email', 'sms', 'whatsapp'], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    const brevoCount = selection.delivery.filter(s => s.tool.id === 'brevo').length;
    expect(brevoCount).toBe(1);
  });

  it('normalizes "WhatsApp" to whatsapp', async () => {
    const discovery = createMockDiscovery({
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: [] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: ['WhatsApp'], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    const deliveryIds = selection.delivery.map(s => s.tool.id);
    expect(deliveryIds).toContain('brevo');
  });

  it('normalizes "tg" to telegram', async () => {
    const discovery = createMockDiscovery({
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: [] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: ['tg'], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    const deliveryIds = selection.delivery.map(s => s.tool.id);
    expect(deliveryIds).toContain('telegram');
  });

  it('normalizes "WA" to whatsapp', async () => {
    const discovery = createMockDiscovery({
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: [] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: ['WA'], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    const deliveryIds = selection.delivery.map(s => s.tool.id);
    expect(deliveryIds.some(id => id === 'brevo' || id === 'baileys')).toBe(true);
  });

  it('selects apify for "web" data source', async () => {
    const discovery = createMockDiscovery({
      availableData: ['web portal data'],
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: ['web scraping'] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: [], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    const enrichmentIds = selection.enrichment.map(s => s.tool.id);
    expect(enrichmentIds).toContain('apify');
  });

  it('selects supermemory for "notion" data source', async () => {
    const discovery = createMockDiscovery({
      availableData: ['notion workspace'],
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: [] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: [], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    const enrichmentIds = selection.enrichment.map(s => s.tool.id);
    expect(enrichmentIds).toContain('supermemory');
  });

  it('selects supermemory for "drive" data source', async () => {
    const discovery = createMockDiscovery({
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: ['google drive files'] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: [], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    const enrichmentIds = selection.enrichment.map(s => s.tool.id);
    expect(enrichmentIds).toContain('supermemory');
  });

  it('no enrichment tools for unrelated data sources', async () => {
    const discovery = createMockDiscovery({
      availableData: ['internal database', 'spreadsheets'],
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: ['internal api'] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: [], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    expect(selection.enrichment).toHaveLength(0);
  });

  it('always selects playwright for testing', async () => {
    const discovery = createMockDiscovery();
    const selection = await selectTools(discovery);
    const testingIds = selection.testing.map(s => s.tool.id);
    expect(testingIds).toContain('playwright');
  });

  it('selects multiple delivery tools for multiple channels', async () => {
    const discovery = createMockDiscovery({
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: [] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: ['email', 'telegram', 'slack'], triggers: [] }
      }
    });

    const selection = await selectTools(discovery);
    const deliveryIds = selection.delivery.map(s => s.tool.id);
    expect(deliveryIds).toContain('brevo');
    expect(deliveryIds).toContain('telegram');
    expect(deliveryIds).toContain('slack');
  });
});

import { describe, it, expect } from 'vitest';
import {
  DiscoveryInputSchema,
  ContextSchema,
  EIIDMappingSchema,
  StrategicAnalysisSchema,
  DiscoveryResultSchema,
  validateInput,
  getInputJsonSchema
} from '../src/discovery/schema.js';

describe('ContextSchema', () => {
  it('validates a valid context', () => {
    const result = ContextSchema.parse({
      forWhom: 'me',
      businessDescription: 'A test business description'
    });
    expect(result.forWhom).toBe('me');
  });

  it('rejects invalid forWhom value', () => {
    expect(() => ContextSchema.parse({
      forWhom: 'nobody',
      businessDescription: 'A test business description'
    })).toThrow();
  });

  it('rejects short businessDescription', () => {
    expect(() => ContextSchema.parse({
      forWhom: 'me',
      businessDescription: 'short'
    })).toThrow();
  });

  it('accepts optional fields', () => {
    const result = ContextSchema.parse({
      forWhom: 'client',
      companyName: 'Acme',
      businessDescription: 'A test business description',
      industry: 'Tech',
      employees: '50',
      revenue: '1M',
      yearsInBusiness: '5'
    });
    expect(result.companyName).toBe('Acme');
    expect(result.industry).toBe('Tech');
  });
});

describe('DiscoveryInputSchema', () => {
  it('validates a minimal valid input', () => {
    const result = DiscoveryInputSchema.parse({
      projectName: 'test',
      context: { forWhom: 'me', businessDescription: 'A test business description' },
      problem: 'A problem that needs solving'
    });
    expect(result.projectName).toBe('test');
    expect(result.desiredOutcome).toBe('');
    expect(result.currentProcess).toEqual([]);
    expect(result.availableData).toEqual([]);
  });

  it('rejects empty projectName', () => {
    expect(() => DiscoveryInputSchema.parse({
      projectName: '',
      context: { forWhom: 'me', businessDescription: 'A test business description' },
      problem: 'A problem that needs solving'
    })).toThrow();
  });

  it('rejects short problem', () => {
    expect(() => DiscoveryInputSchema.parse({
      projectName: 'test',
      context: { forWhom: 'me', businessDescription: 'A test business description' },
      problem: 'short'
    })).toThrow();
  });

  it('rejects missing context', () => {
    expect(() => DiscoveryInputSchema.parse({
      projectName: 'test',
      problem: 'A problem that needs solving'
    })).toThrow();
  });

  it('defaults optional arrays to empty', () => {
    const result = DiscoveryInputSchema.parse({
      projectName: 'test',
      context: { forWhom: 'me', businessDescription: 'A test business description' },
      problem: 'A problem that needs solving'
    });
    expect(result.currentProcess).toEqual([]);
    expect(result.availableData).toEqual([]);
  });

  it('defaults desiredOutcome to empty string', () => {
    const result = DiscoveryInputSchema.parse({
      projectName: 'test',
      context: { forWhom: 'me', businessDescription: 'A test business description' },
      problem: 'A problem that needs solving'
    });
    expect(result.desiredOutcome).toBe('');
  });
});

describe('EIIDMappingSchema', () => {
  it('validates a valid EIID mapping', () => {
    const result = EIIDMappingSchema.parse({
      enrichment: { existingData: ['a'], missingData: ['b'], sources: ['c'] },
      inference: { patterns: ['p'], predictions: ['q'], anomalies: ['r'] },
      interpretation: { insights: ['i'] },
      delivery: { channels: ['email'], triggers: ['t'] }
    });
    expect(result.enrichment.existingData).toEqual(['a']);
    expect(result.delivery.channels).toEqual(['email']);
  });

  it('rejects missing enrichment', () => {
    expect(() => EIIDMappingSchema.parse({
      inference: { patterns: [], predictions: [], anomalies: [] },
      interpretation: { insights: [] },
      delivery: { channels: [], triggers: [] }
    })).toThrow();
  });

  it('rejects wrong types in arrays', () => {
    expect(() => EIIDMappingSchema.parse({
      enrichment: { existingData: [123], missingData: [], sources: [] },
      inference: { patterns: [], predictions: [], anomalies: [] },
      interpretation: { insights: [] },
      delivery: { channels: [], triggers: [] }
    })).toThrow();
  });
});

describe('StrategicAnalysisSchema', () => {
  it('validates a valid strategic analysis', () => {
    const result = StrategicAnalysisSchema.parse({
      industryContext: 'context',
      valueMovement: 'movement',
      currentPosition: 'current',
      targetPosition: 'target',
      opportunities: ['opp1']
    });
    expect(result.industryContext).toBe('context');
  });

  it('rejects missing fields', () => {
    expect(() => StrategicAnalysisSchema.parse({
      industryContext: 'context'
    })).toThrow();
  });
});

describe('DiscoveryResultSchema', () => {
  it('validates a complete discovery result', () => {
    const result = DiscoveryResultSchema.parse({
      projectName: 'test',
      context: { forWhom: 'me', businessDescription: 'A test business description' },
      problem: 'A problem statement',
      desiredOutcome: 'outcome',
      currentProcess: [],
      availableData: [],
      strategicAnalysis: {
        industryContext: 'ctx',
        valueMovement: 'mv',
        currentPosition: 'cur',
        targetPosition: 'tgt',
        opportunities: []
      },
      eiidMapping: {
        enrichment: { existingData: [], missingData: [], sources: [] },
        inference: { patterns: [], predictions: [], anomalies: [] },
        interpretation: { insights: [] },
        delivery: { channels: [], triggers: [] }
      },
      createdAt: '2025-01-01T00:00:00Z'
    });
    expect(result.projectName).toBe('test');
  });
});

describe('validateInput', () => {
  it('returns validated data for valid input', () => {
    const result = validateInput({
      projectName: 'test',
      context: { forWhom: 'me', businessDescription: 'A test business description' },
      problem: 'A problem that needs solving'
    });
    expect(result.projectName).toBe('test');
  });

  it('throws ZodError for invalid input', () => {
    expect(() => validateInput({})).toThrow();
  });
});

describe('getInputJsonSchema', () => {
  it('returns a valid JSON Schema object', () => {
    const schema = getInputJsonSchema();
    expect(schema).toHaveProperty('$schema');
    expect(schema).toHaveProperty('type', 'object');
    expect(schema).toHaveProperty('required');
    expect(schema).toHaveProperty('properties');
  });

  it('includes projectName, context, problem as required', () => {
    const schema = getInputJsonSchema() as { required: string[] };
    expect(schema.required).toContain('projectName');
    expect(schema.required).toContain('context');
    expect(schema.required).toContain('problem');
  });
});

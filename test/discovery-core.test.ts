import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockCreate = vi.fn();

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: vi.fn().mockImplementation(function () {
      return { messages: { create: mockCreate } };
    })
  };
});

import { processJsonInput, ValidationError } from '../src/discovery/core.js';

const validAnalysis = {
  strategicAnalysis: {
    industryContext: 'Test industry',
    valueMovement: 'Test movement',
    currentPosition: 'Test current',
    targetPosition: 'Test target',
    opportunities: ['opp1']
  },
  eiidMapping: {
    enrichment: { existingData: ['d1'], missingData: ['m1'], sources: ['s1'] },
    inference: { patterns: ['p1'], predictions: ['pr1'], anomalies: ['a1'] },
    interpretation: { insights: ['i1'] },
    delivery: { channels: ['email'], triggers: ['t1'] }
  }
};

describe('ValidationError', () => {
  it('has name ValidationError', () => {
    const err = new ValidationError([{ path: 'field', message: 'required' }]);
    expect(err.name).toBe('ValidationError');
  });

  it('includes errors in message', () => {
    const err = new ValidationError([
      { path: 'projectName', message: 'Required' },
      { path: 'problem', message: 'Too short' }
    ]);
    expect(err.message).toContain('projectName');
    expect(err.message).toContain('problem');
  });

  it('exposes errors array', () => {
    const errors = [{ path: 'field', message: 'required' }];
    const err = new ValidationError(errors);
    expect(err.errors).toEqual(errors);
  });

  it('is an instance of Error', () => {
    const err = new ValidationError([]);
    expect(err).toBeInstanceOf(Error);
  });
});

describe('processJsonInput', () => {
  beforeEach(() => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-key');
    mockCreate.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('validates input then returns analysis result', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validAnalysis) }]
    });

    const result = await processJsonInput({
      projectName: 'Test',
      context: { forWhom: 'me', businessDescription: 'A test business description' },
      problem: 'A problem that needs solving'
    });

    expect(result.projectName).toBe('Test');
    expect(result.strategicAnalysis).toBeDefined();
    expect(result.eiidMapping).toBeDefined();
  });

  it('throws ValidationError for missing projectName', async () => {
    await expect(processJsonInput({
      context: { forWhom: 'me', businessDescription: 'A test business description' },
      problem: 'A problem that needs solving'
    })).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError for short problem', async () => {
    await expect(processJsonInput({
      projectName: 'Test',
      context: { forWhom: 'me', businessDescription: 'A test business description' },
      problem: 'short'
    })).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError for empty object', async () => {
    await expect(processJsonInput({})).rejects.toThrow(ValidationError);
  });

  it('transforms ZodError paths correctly', async () => {
    try {
      await processJsonInput({
        projectName: '',
        context: { forWhom: 'invalid', businessDescription: 'short' },
        problem: ''
      });
      expect.unreachable('Should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
      const err = e as ValidationError;
      expect(err.errors.length).toBeGreaterThan(0);
      expect(err.errors.every(e => typeof e.path === 'string')).toBe(true);
      expect(err.errors.every(e => typeof e.message === 'string')).toBe(true);
    }
  });

  it('applies defaults for optional fields', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validAnalysis) }]
    });

    const result = await processJsonInput({
      projectName: 'Test',
      context: { forWhom: 'me', businessDescription: 'A test business description' },
      problem: 'A problem that needs solving'
    });

    expect(result.desiredOutcome).toBe('');
    expect(result.currentProcess).toEqual([]);
    expect(result.availableData).toEqual([]);
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockCreate = vi.fn();

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: vi.fn().mockImplementation(function () {
      return { messages: { create: mockCreate } };
    })
  };
});

import { analyzeDiscoveryInput, analyzeRawContent, stripMarkdownFences } from '../src/discovery/analyze.js';
import type { DiscoveryInput } from '../src/discovery/types.js';

const validAnalysis = {
  strategicAnalysis: {
    industryContext: 'Test industry',
    valueMovement: 'Test movement',
    currentPosition: 'Test current',
    targetPosition: 'Test target',
    opportunities: ['opp1', 'opp2']
  },
  eiidMapping: {
    enrichment: {
      existingData: ['data1'],
      missingData: ['missing1'],
      sources: ['source1']
    },
    inference: {
      patterns: ['pattern1'],
      predictions: ['prediction1'],
      anomalies: ['anomaly1']
    },
    interpretation: {
      insights: ['insight1']
    },
    delivery: {
      channels: ['email'],
      triggers: ['trigger1']
    }
  }
};

const validInput: DiscoveryInput = {
  projectName: 'Test Project',
  context: {
    forWhom: 'me',
    businessDescription: 'A test business description'
  },
  problem: 'A problem that needs solving',
  desiredOutcome: 'Test outcome',
  currentProcess: ['Step 1'],
  availableData: ['Data source 1']
};

describe('stripMarkdownFences', () => {
  it('strips ```json fences', () => {
    const input = '```json\n{"key": "value"}\n```';
    expect(stripMarkdownFences(input)).toBe('{"key": "value"}');
  });

  it('strips bare ``` fences', () => {
    const input = '```\n{"key": "value"}\n```';
    expect(stripMarkdownFences(input)).toBe('{"key": "value"}');
  });

  it('returns plain JSON unchanged', () => {
    const input = '{"key": "value"}';
    expect(stripMarkdownFences(input)).toBe('{"key": "value"}');
  });

  it('handles whitespace around fences', () => {
    const input = '  ```json\n{"key": "value"}\n```  ';
    expect(stripMarkdownFences(input)).toBe('{"key": "value"}');
  });
});

describe('analyzeDiscoveryInput', () => {
  beforeEach(() => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-key');
    mockCreate.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns DiscoveryResult for valid JSON response', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validAnalysis) }]
    });

    const result = await analyzeDiscoveryInput(validInput);
    expect(result.projectName).toBe('Test Project');
    expect(result.strategicAnalysis.industryContext).toBe('Test industry');
    expect(result.eiidMapping.enrichment.existingData).toEqual(['data1']);
    expect(result.eiidMapping.delivery.channels).toEqual(['email']);
    expect(result.createdAt).toBeDefined();
  });

  it('throws when API key is missing', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '');
    // Clear the env var
    delete process.env.ANTHROPIC_API_KEY;

    await expect(analyzeDiscoveryInput(validInput)).rejects.toThrow('ANTHROPIC_API_KEY');
  });

  it('sends correct model and max_tokens to API', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validAnalysis) }]
    });

    await analyzeDiscoveryInput(validInput);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: expect.any(String),
        max_tokens: 4096
      })
    );
  });

  it('uses SUPERSKILLS_MODEL env var when set', async () => {
    vi.stubEnv('SUPERSKILLS_MODEL', 'claude-haiku-4-5-20251001');
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validAnalysis) }]
    });

    await analyzeDiscoveryInput(validInput);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'claude-haiku-4-5-20251001'
      })
    );
  });

  it('throws when response has no text content', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'tool_use', id: 'x', name: 'y', input: {} }]
    });

    await expect(analyzeDiscoveryInput(validInput)).rejects.toThrow('No text response');
  });

  it('throws with preview when JSON is invalid', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'not valid json at all' }]
    });

    await expect(analyzeDiscoveryInput(validInput)).rejects.toThrow('Failed to parse');
  });

  it('handles markdown-wrapped JSON response', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: '```json\n' + JSON.stringify(validAnalysis) + '\n```' }]
    });

    const result = await analyzeDiscoveryInput(validInput);
    expect(result.strategicAnalysis.industryContext).toBe('Test industry');
  });

  it('throws when strategicAnalysis is missing', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify({ eiidMapping: validAnalysis.eiidMapping }) }]
    });

    await expect(analyzeDiscoveryInput(validInput)).rejects.toThrow();
  });

  it('throws when eiidMapping is missing', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify({ strategicAnalysis: validAnalysis.strategicAnalysis }) }]
    });

    await expect(analyzeDiscoveryInput(validInput)).rejects.toThrow();
  });

  it('preserves input fields in result', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validAnalysis) }]
    });

    const result = await analyzeDiscoveryInput(validInput);
    expect(result.projectName).toBe(validInput.projectName);
    expect(result.problem).toBe(validInput.problem);
    expect(result.desiredOutcome).toBe(validInput.desiredOutcome);
    expect(result.context).toEqual(validInput.context);
  });

  it('sets createdAt to current timestamp', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validAnalysis) }]
    });

    const before = new Date().toISOString();
    const result = await analyzeDiscoveryInput(validInput);
    const after = new Date().toISOString();

    expect(result.createdAt >= before).toBe(true);
    expect(result.createdAt <= after).toBe(true);
  });
});

describe('analyzeRawContent', () => {
  beforeEach(() => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-key');
    mockCreate.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('makes 2 API calls (extraction then analysis)', async () => {
    const extractedInput = {
      projectName: 'Extracted Project',
      context: { forWhom: 'me', businessDescription: 'extracted business' },
      problem: 'extracted problem',
      desiredOutcome: 'extracted outcome',
      currentProcess: [],
      availableData: []
    };

    mockCreate
      .mockResolvedValueOnce({
        content: [{ type: 'text', text: JSON.stringify(extractedInput) }]
      })
      .mockResolvedValueOnce({
        content: [{ type: 'text', text: JSON.stringify(validAnalysis) }]
      });

    await analyzeRawContent('Some raw content for analysis', 'text');
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it('throws when extraction returns no text', async () => {
    mockCreate.mockResolvedValueOnce({
      content: []
    });

    await expect(analyzeRawContent('content', 'text')).rejects.toThrow('No response from extraction');
  });

  it('throws when extraction returns invalid JSON', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'not json' }]
    });

    await expect(analyzeRawContent('content', 'text')).rejects.toThrow('Failed to extract');
  });
});

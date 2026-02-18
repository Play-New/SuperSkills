import { ZodError } from 'zod';
import type { DiscoveryInput, DiscoveryResult } from './types.js';
import { analyzeDiscoveryInput, analyzeRawContent } from './analyze.js';
import { validateInput, type ValidatedDiscoveryInput } from './schema.js';

export class ValidationError extends Error {
  constructor(public errors: Array<{ path: string; message: string }>) {
    super(`Validation failed: ${errors.map(e => `${e.path}: ${e.message}`).join(', ')}`);
    this.name = 'ValidationError';
  }
}

export async function processDiscoveryInput(
  input: DiscoveryInput
): Promise<DiscoveryResult> {
  return analyzeDiscoveryInput(input);
}

export async function processRawContent(
  content: string,
  contentType: 'text' | 'file',
  fileName?: string
): Promise<DiscoveryResult> {
  return analyzeRawContent(content, contentType, fileName);
}

export async function processJsonInput(
  data: unknown
): Promise<DiscoveryResult> {
  let validated: ValidatedDiscoveryInput;

  try {
    validated = validateInput(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(
        error.issues.map(e => ({
          path: e.path.map(String).join('.'),
          message: e.message
        }))
      );
    }
    throw error;
  }

  const input: DiscoveryInput = {
    projectName: validated.projectName,
    context: {
      forWhom: validated.context.forWhom,
      companyName: validated.context.companyName,
      businessDescription: validated.context.businessDescription,
      industry: validated.context.industry,
      employees: validated.context.employees,
      revenue: validated.context.revenue,
      yearsInBusiness: validated.context.yearsInBusiness
    },
    problem: validated.problem,
    desiredOutcome: validated.desiredOutcome || '',
    currentProcess: validated.currentProcess || [],
    availableData: validated.availableData || []
  };

  return processDiscoveryInput(input);
}

export { validateInput, getInputJsonSchema } from './schema.js';

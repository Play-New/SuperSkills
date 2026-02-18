import { z } from 'zod';

export const ContextSchema = z.object({
  forWhom: z.enum(['me', 'my_company', 'client']),
  companyName: z.string().optional(),
  businessDescription: z.string().min(10),
  industry: z.string().optional(),
  employees: z.string().optional(),
  revenue: z.string().optional(),
  yearsInBusiness: z.string().optional()
});

export const DiscoveryInputSchema = z.object({
  projectName: z.string().min(1),
  context: ContextSchema,
  problem: z.string().min(10),
  desiredOutcome: z.string().optional().default(''),
  currentProcess: z.array(z.string()).optional().default([]),
  availableData: z.array(z.string()).optional().default([])
});

export const EIIDMappingSchema = z.object({
  enrichment: z.object({
    existingData: z.array(z.string()),
    missingData: z.array(z.string()),
    sources: z.array(z.string())
  }),
  inference: z.object({
    patterns: z.array(z.string()),
    predictions: z.array(z.string()),
    anomalies: z.array(z.string())
  }),
  interpretation: z.object({
    insights: z.array(z.string())
  }),
  delivery: z.object({
    channels: z.array(z.string()),
    triggers: z.array(z.string())
  })
});

export const StrategicAnalysisSchema = z.object({
  industryContext: z.string(),
  valueMovement: z.string(),
  currentPosition: z.string(),
  targetPosition: z.string(),
  opportunities: z.array(z.string())
});

export const DiscoveryResultSchema = z.object({
  projectName: z.string(),
  context: ContextSchema,
  problem: z.string(),
  desiredOutcome: z.string(),
  currentProcess: z.array(z.string()),
  availableData: z.array(z.string()),
  strategicAnalysis: StrategicAnalysisSchema,
  eiidMapping: EIIDMappingSchema,
  createdAt: z.string()
});

export type ValidatedDiscoveryInput = z.infer<typeof DiscoveryInputSchema>;

export function validateInput(data: unknown): ValidatedDiscoveryInput {
  return DiscoveryInputSchema.parse(data);
}

export function getInputJsonSchema(): object {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'DiscoveryInput',
    type: 'object',
    required: ['projectName', 'context', 'problem'],
    properties: {
      projectName: { type: 'string', minLength: 1 },
      context: {
        type: 'object',
        required: ['forWhom', 'businessDescription'],
        properties: {
          forWhom: { type: 'string', enum: ['me', 'my_company', 'client'] },
          companyName: { type: 'string' },
          businessDescription: { type: 'string', minLength: 10 },
          industry: { type: 'string' },
          employees: { type: 'string' },
          revenue: { type: 'string' },
          yearsInBusiness: { type: 'string' }
        }
      },
      problem: { type: 'string', minLength: 10 },
      desiredOutcome: { type: 'string' },
      currentProcess: { type: 'array', items: { type: 'string' } },
      availableData: { type: 'array', items: { type: 'string' } }
    }
  };
}

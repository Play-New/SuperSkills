import Anthropic from '@anthropic-ai/sdk';
import type { DiscoveryInput, DiscoveryResult } from './types.js';
import { StrategicAnalysisSchema, EIIDMappingSchema } from './schema.js';

const ANALYSIS_PROMPT = `Generate strategic analysis for the following project.

ANALYSIS FRAMEWORKS:

1. Value Movement (Wardley for mapping, Reshuffle for AI-era value shifts)
   - What's commoditizing in this industry
   - Where value is shifting
   - New coordination possibilities
   - Falling constraints

2. EIID Framework (four layers)
   - Enrichment: existing data, missing data, sources to fill gaps
   - Inference: patterns to detect, predictions to make, anomalies to watch
   - Interpretation: insights to generate from inference results
   - Delivery: channels to reach users, triggers that determine timing

3. AI-Native Architecture (Steinberger principle: intelligence goes where the user is)
   - Push insights to users proactively
   - Deliver where users already are (email, Slack, WhatsApp, Telegram)
   - Dashboard for configuration, not for discovering problems

OUTPUT: JSON only, no markdown, no explanation.

{
  "strategicAnalysis": {
    "industryContext": "Industry dynamics and trends",
    "valueMovement": "Where value is shifting",
    "currentPosition": "Current position",
    "targetPosition": "Strategic target position",
    "opportunities": ["opportunity 1", "opportunity 2"]
  },
  "eiidMapping": {
    "enrichment": {
      "existingData": ["source 1"],
      "missingData": ["missing 1"],
      "sources": ["where to get it"]
    },
    "inference": {
      "patterns": ["pattern"],
      "predictions": ["prediction"],
      "anomalies": ["anomaly"]
    },
    "interpretation": {
      "insights": ["insight"]
    },
    "delivery": {
      "channels": ["email", "slack"],
      "triggers": ["trigger condition"]
    }
  }
}

STYLE: Direct statements. No "I recommend", no "you should". Facts and analysis only.`;

const DEFAULT_MODEL = 'claude-opus-4-6';

function getModel(): string {
  return process.env.SUPERSKILLS_MODEL || DEFAULT_MODEL;
}

export function stripMarkdownFences(text: string): string {
  const match = text.match(/^\s*```(?:json)?\s*\n?([\s\S]*?)\n?\s*```\s*$/);
  return match ? match[1] : text;
}

export async function analyzeDiscoveryInput(input: DiscoveryInput): Promise<DiscoveryResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable required');
  }

  const client = new Anthropic({ apiKey });
  const inputText = formatInputForAnalysis(input);

  const response = await client.messages.create({
    model: getModel(),
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `${ANALYSIS_PROMPT}\n\n---\n\nPROJECT INFORMATION:\n\n${inputText}`
    }]
  });

  const textContent = response.content.find(c => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from API');
  }

  const cleaned = stripMarkdownFences(textContent.text);

  let analysis: Record<string, unknown>;
  try {
    analysis = JSON.parse(cleaned);
  } catch {
    throw new Error(`Failed to parse analysis response: ${cleaned.slice(0, 200)}...`);
  }

  const strategicAnalysis = StrategicAnalysisSchema.parse(analysis.strategicAnalysis);
  const eiidMapping = EIIDMappingSchema.parse(analysis.eiidMapping);

  return {
    ...input,
    strategicAnalysis,
    eiidMapping,
    createdAt: new Date().toISOString()
  };
}

function formatInputForAnalysis(input: DiscoveryInput): string {
  const lines: string[] = [];

  lines.push(`Project: ${input.projectName}`);
  lines.push('');
  lines.push('CONTEXT:');

  if (input.context.forWhom === 'client') {
    lines.push(`Client: ${input.context.companyName || 'Not specified'}`);
  } else if (input.context.forWhom === 'my_company') {
    lines.push(`Company: ${input.context.companyName || 'Own company'}`);
  } else {
    lines.push('For: Personal/freelance project');
  }

  lines.push(`Business: ${input.context.businessDescription}`);
  if (input.context.industry) lines.push(`Industry: ${input.context.industry}`);
  if (input.context.employees) lines.push(`Employees: ${input.context.employees}`);
  if (input.context.revenue) lines.push(`Revenue: ${input.context.revenue}`);
  if (input.context.yearsInBusiness) lines.push(`Years in business: ${input.context.yearsInBusiness}`);
  lines.push('');

  lines.push('PROBLEM:');
  lines.push(input.problem);
  lines.push('');

  lines.push('DESIRED OUTCOME:');
  lines.push(input.desiredOutcome);
  lines.push('');

  lines.push('CURRENT PROCESS:');
  input.currentProcess.forEach((step, i) => {
    lines.push(`${i + 1}. ${step}`);
  });
  lines.push('');

  lines.push('AVAILABLE DATA:');
  input.availableData.forEach(data => {
    lines.push(`- ${data}`);
  });

  return lines.join('\n');
}

export async function analyzeRawContent(
  content: string,
  contentType: 'text' | 'file',
  fileName?: string
): Promise<DiscoveryResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable required');
  }

  const client = new Anthropic({ apiKey });

  const extractPrompt = `Extract project information from this ${contentType === 'file' ? `file (${fileName})` : 'text'}.

Return a JSON object with these fields (infer what you can, leave empty string if not found):

{
  "projectName": "suggested project name based on content",
  "context": {
    "forWhom": "me" | "my_company" | "client",
    "companyName": "company name if mentioned",
    "businessDescription": "what the business does",
    "industry": "industry/sector",
    "employees": "number if mentioned",
    "revenue": "revenue if mentioned",
    "yearsInBusiness": "years if mentioned"
  },
  "problem": "the problem being solved",
  "desiredOutcome": "what success looks like",
  "currentProcess": ["step 1", "step 2", "..."],
  "availableData": ["data source 1", "..."]
}

Content to analyze:

${content}`;

  const extractResponse = await client.messages.create({
    model: getModel(),
    max_tokens: 2048,
    messages: [{ role: 'user', content: extractPrompt }]
  });

  const extractText = extractResponse.content.find(c => c.type === 'text');
  if (!extractText || extractText.type !== 'text') {
    throw new Error('No response from extraction');
  }

  const cleanedExtract = stripMarkdownFences(extractText.text);

  let input: DiscoveryInput;
  try {
    input = JSON.parse(cleanedExtract);
  } catch {
    throw new Error(`Failed to extract structure: ${cleanedExtract.slice(0, 200)}...`);
  }

  return analyzeDiscoveryInput(input);
}

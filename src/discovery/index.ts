import * as p from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'path';

import type { InputMode, Context, DiscoveryInput, DiscoveryResult } from './types.js';
import { processDiscoveryInput, processRawContent } from './core.js';

export { processJsonInput, getInputJsonSchema, ValidationError } from './core.js';

export async function runDiscovery(): Promise<DiscoveryResult | null> {
  p.intro(pc.bgCyan(pc.black(' Discovery ')));
  console.log(pc.dim('\n  Strategic planning for AI-native projects.\n'));

  if (!process.env.ANTHROPIC_API_KEY) {
    p.log.info(
      `You need an Anthropic API key for the AI analysis step.\n` +
      pc.dim(`  Get one here (free tier available): `) +
      pc.cyan(`https://console.anthropic.com/settings/keys\n`) +
      pc.dim(`  To skip this prompt next time: `) +
      pc.cyan(`export ANTHROPIC_API_KEY=sk-ant-...`)
    );
    const key = await p.text({
      message: 'Paste your Anthropic API key:',
      placeholder: 'sk-ant-api03-...',
      validate: (v) => {
        if (!v) return 'API key is required. Get one at console.anthropic.com/settings/keys';
        if (!v.startsWith('sk-ant-')) return 'Should start with sk-ant-. Check you copied the full key.';
        return undefined;
      }
    });
    if (p.isCancel(key)) {
      p.cancel('Cancelled');
      return null;
    }
    process.env.ANTHROPIC_API_KEY = key as string;
  }

  const inputMode = await chooseInputMode();
  if (!inputMode) return null;

  let result: DiscoveryResult | null = null;

  if (inputMode === 'paste') {
    result = await handlePasteInput();
  } else if (inputMode === 'file') {
    result = await handleFileInput();
  } else {
    result = await handleQuestionsInput();
  }

  if (!result) return null;

  displayResult(result);

  // Save discovery.json to disk
  const outputPath = path.resolve('discovery.json');
  await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
  p.log.info(`Saved to ${pc.cyan(outputPath)}`);

  p.outro(pc.green('Discovery complete.'));

  return result;
}

async function chooseInputMode(): Promise<InputMode | null> {
  const mode = await p.select({
    message: 'How would you like to provide project information?',
    options: [
      { value: 'paste' as const, label: 'Paste text', hint: 'Brief, email, notes' },
      { value: 'file' as const, label: 'Load file', hint: 'Text or Markdown' },
      { value: 'questions' as const, label: 'Answer questions', hint: 'Guided flow' }
    ]
  });

  if (p.isCancel(mode)) {
    p.cancel('Cancelled');
    return null;
  }

  return mode as InputMode;
}

async function handlePasteInput(): Promise<DiscoveryResult | null> {
  const content = await p.text({
    message: 'Paste your content:',
    placeholder: 'Brief, requirements, notes...',
    validate: (v) => (!v || v.length < 50) ? 'Provide more detail' : undefined
  });

  if (p.isCancel(content)) return null;

  return runAnalysis(() => processRawContent(content as string, 'text'));
}

async function handleFileInput(): Promise<DiscoveryResult | null> {
  const filePath = await p.text({
    message: 'File path:',
    placeholder: '/path/to/file.md'
  });

  if (p.isCancel(filePath)) return null;

  const resolved = path.resolve(filePath as string);

  if (!await fs.pathExists(resolved)) {
    p.log.error(`File not found: ${resolved}`);
    return null;
  }

  const ext = path.extname(resolved).toLowerCase();
  if (!['.txt', '.md', '.markdown'].includes(ext)) {
    p.log.error('Only .txt and .md files supported');
    return null;
  }

  const content = await fs.readFile(resolved, 'utf-8');
  const fileName = path.basename(resolved);

  return runAnalysis(() => processRawContent(content, 'file', fileName));
}

async function handleQuestionsInput(): Promise<DiscoveryResult | null> {
  const projectName = await p.text({
    message: 'Project name?',
    placeholder: 'e.g., order-automation, sales-copilot'
  });
  if (p.isCancel(projectName)) return null;

  const context = await collectContext();
  if (!context) return null;

  const problem = await p.text({
    message: 'What problem are you solving?',
    placeholder: 'e.g., "4 hours/day spent on manual order processing"',
    validate: (v) => (!v || v.length < 10) ? 'Describe the problem' : undefined
  });
  if (p.isCancel(problem)) return null;

  const desiredOutcome = await p.text({
    message: 'What does success look like?',
    placeholder: 'e.g., "Orders processed automatically, team focuses on customers"'
  });
  if (p.isCancel(desiredOutcome)) return null;

  const processText = await p.text({
    message: 'Current process steps? (comma separated)',
    placeholder: 'e.g., "Check email, copy to Excel, verify stock, call supplier"'
  });
  if (p.isCancel(processText)) return null;

  const dataText = await p.text({
    message: 'What data/systems do you have access to?',
    placeholder: 'e.g., "Gmail, Odoo ERP, supplier portal, Excel files"'
  });
  if (p.isCancel(dataText)) return null;

  const input: DiscoveryInput = {
    projectName: projectName as string,
    context,
    problem: problem as string,
    desiredOutcome: (desiredOutcome as string) || '',
    currentProcess: parseList(processText as string),
    availableData: parseList(dataText as string)
  };

  return runAnalysis(() => processDiscoveryInput(input));
}

async function collectContext(): Promise<Context | null> {
  const forWhom = await p.select({
    message: 'Who is this project for?',
    options: [
      { value: 'me' as const, label: 'Me', hint: 'Personal or freelance' },
      { value: 'my_company' as const, label: 'My company', hint: 'Your own business' },
      { value: 'client' as const, label: 'A client', hint: 'External company' }
    ]
  });
  if (p.isCancel(forWhom)) return null;

  let companyName: string | undefined;
  if (forWhom !== 'me') {
    const name = await p.text({
      message: forWhom === 'client' ? 'Client name?' : 'Company name?',
      placeholder: 'e.g., Acme Corp'
    });
    if (p.isCancel(name)) return null;
    companyName = name as string;
  }

  const businessDescription = await p.text({
    message: forWhom === 'me' ? 'What do you do?' : 'What does the company do?',
    placeholder: 'e.g., "B2B hardware distribution, 200 employees, Lombardy"',
    validate: (v) => (!v || v.length < 10) ? 'Describe the business (include industry and size if relevant)' : undefined
  });
  if (p.isCancel(businessDescription)) return null;

  return {
    forWhom: forWhom as 'me' | 'my_company' | 'client',
    companyName: companyName || undefined,
    businessDescription: businessDescription as string
  };
}

async function runAnalysis(
  analyzeFn: () => Promise<DiscoveryResult>
): Promise<DiscoveryResult | null> {
  const spinner = p.spinner();
  spinner.start('Generating strategic analysis...');

  try {
    const result = await analyzeFn();
    spinner.stop('Analysis complete');
    return result;
  } catch (error) {
    spinner.stop('Analysis failed');
    if (error instanceof Error) {
      if (error.message.includes('ANTHROPIC_API_KEY')) {
        p.log.error('ANTHROPIC_API_KEY required');
        p.log.info('export ANTHROPIC_API_KEY=your-key');
      } else {
        p.log.error(error.message);
      }
    }
    return null;
  }
}

function displayResult(result: DiscoveryResult): void {
  console.log('');

  p.note(
    pc.bold('Industry Context\n') +
    pc.dim(result.strategicAnalysis.industryContext) + '\n\n' +
    pc.bold('Value Movement\n') +
    pc.dim(result.strategicAnalysis.valueMovement) + '\n\n' +
    pc.bold('Current Position\n') +
    pc.dim(result.strategicAnalysis.currentPosition) + '\n\n' +
    pc.bold('Target Position\n') +
    pc.dim(result.strategicAnalysis.targetPosition) + '\n\n' +
    pc.bold('Opportunities\n') +
    result.strategicAnalysis.opportunities.map(o => pc.dim(`• ${o}`)).join('\n'),
    'Strategic Analysis'
  );

  p.note(
    pc.bold('Enrichment\n') +
    pc.dim(`Data: ${result.eiidMapping.enrichment.existingData.join(', ')}\n`) +
    pc.dim(`Missing: ${result.eiidMapping.enrichment.missingData.join(', ')}\n`) +
    pc.dim(`Sources: ${result.eiidMapping.enrichment.sources.join(', ')}`) + '\n\n' +
    pc.bold('Inference\n') +
    pc.dim(`Patterns: ${result.eiidMapping.inference.patterns.join(', ')}\n`) +
    pc.dim(`Predictions: ${result.eiidMapping.inference.predictions.join(', ')}`) + '\n\n' +
    pc.bold('Interpretation\n') +
    pc.dim(`Insights: ${result.eiidMapping.interpretation.insights.join(', ')}`) + '\n\n' +
    pc.bold('Delivery\n') +
    pc.dim(`Channels: ${result.eiidMapping.delivery.channels.join(', ')}\n`) +
    pc.dim(`Triggers: ${result.eiidMapping.delivery.triggers.join(', ')}`),
    'AI-Native Architecture (EIID)'
  );
}

function parseList(text: string): string[] {
  if (!text) return [];
  return text.split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 0);
}

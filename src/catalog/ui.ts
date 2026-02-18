import * as p from '@clack/prompts';
import pc from 'picocolors';
import type { DiscoveryResult } from '../discovery/types.js';
import type { SelectionResult, ToolSuggestion } from './types.js';
import { selectTools, getEnvVars, getSdkPackages } from './index.js';

export async function runToolSelection(discoveryResult: DiscoveryResult): Promise<SelectionResult | null> {
  p.intro(pc.bgMagenta(pc.black(' Tool Selection ')));
  console.log(pc.dim('\n  Selecting tools based on your EIID mapping.\n'));

  const spinner = p.spinner();
  spinner.start('Analyzing requirements...');

  const suggestions = await selectTools(discoveryResult);

  spinner.stop('Analysis complete');

  // Display core tools (always included)
  console.log('');
  p.note(
    suggestions.core.map(s =>
      `${pc.bold(s.tool.name)}\n${pc.dim(s.tool.description)}\n${pc.dim(`SDK: ${s.tool.sdk || 'N/A'}`)}`
    ).join('\n\n'),
    'Core Stack (always included)'
  );

  // Let user confirm/modify delivery tools
  if (suggestions.delivery.length > 0) {
    const deliveryChoices = await confirmDeliveryTools(suggestions.delivery);
    if (!deliveryChoices) return null;

    // Update suggestions based on user choices
    suggestions.delivery = suggestions.delivery.filter(s =>
      deliveryChoices.includes(s.tool.id)
    );
  }

  // Let user confirm/modify enrichment tools
  if (suggestions.enrichment.length > 0) {
    const enrichmentChoices = await confirmEnrichmentTools(suggestions.enrichment);
    if (!enrichmentChoices) return null;

    suggestions.enrichment = suggestions.enrichment.filter(s =>
      enrichmentChoices.includes(s.tool.id)
    );
  }

  // Update all list
  suggestions.all = [
    ...suggestions.core,
    ...suggestions.delivery,
    ...suggestions.enrichment
  ];

  // Display summary
  displaySummary(suggestions);

  p.outro(pc.green('Tool selection complete.'));

  return suggestions;
}

async function confirmDeliveryTools(suggestions: ToolSuggestion[]): Promise<string[] | null> {
  const options = suggestions.map(s => ({
    value: s.tool.id,
    label: s.tool.name,
    hint: s.reason + (s.tool.risk ? ` (${s.tool.risk})` : '')
  }));

  const selected = await p.multiselect({
    message: 'Confirm delivery tools:',
    options,
    initialValues: suggestions.filter(s => s.required).map(s => s.tool.id),
    required: false
  });

  if (p.isCancel(selected)) {
    p.cancel('Cancelled');
    return null;
  }

  return selected as string[];
}

async function confirmEnrichmentTools(suggestions: ToolSuggestion[]): Promise<string[] | null> {
  const options = suggestions.map(s => ({
    value: s.tool.id,
    label: s.tool.name,
    hint: s.reason
  }));

  const selected = await p.multiselect({
    message: 'Confirm enrichment tools (optional):',
    options,
    initialValues: [] as string[],
    required: false
  });

  if (p.isCancel(selected)) {
    p.cancel('Cancelled');
    return null;
  }

  return selected as string[];
}

function displaySummary(result: SelectionResult): void {
  console.log('');

  const packages = getSdkPackages(result);
  const envVars = getEnvVars(result);

  const toolList = result.all.map(s => `• ${s.tool.name}`).join('\n');

  p.note(
    pc.bold('Selected Tools:\n') + pc.dim(toolList) + '\n\n' +
    pc.bold('NPM Packages:\n') + pc.dim(packages.join('\n')) + '\n\n' +
    pc.bold('Environment Variables:\n') + pc.dim(envVars.join('\n')),
    'Summary'
  );
}

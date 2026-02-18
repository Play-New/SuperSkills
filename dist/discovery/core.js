import { ZodError } from 'zod';
import { analyzeDiscoveryInput, analyzeRawContent } from './analyze.js';
import { validateInput } from './schema.js';
export class ValidationError extends Error {
    errors;
    constructor(errors) {
        super(`Validation failed: ${errors.map(e => `${e.path}: ${e.message}`).join(', ')}`);
        this.errors = errors;
        this.name = 'ValidationError';
    }
}
export async function processDiscoveryInput(input) {
    return analyzeDiscoveryInput(input);
}
export async function processRawContent(content, contentType, fileName) {
    return analyzeRawContent(content, contentType, fileName);
}
export async function processJsonInput(data) {
    let validated;
    try {
        validated = validateInput(data);
    }
    catch (error) {
        if (error instanceof ZodError) {
            throw new ValidationError(error.issues.map(e => ({
                path: e.path.map(String).join('.'),
                message: e.message
            })));
        }
        throw error;
    }
    const input = {
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
//# sourceMappingURL=core.js.map
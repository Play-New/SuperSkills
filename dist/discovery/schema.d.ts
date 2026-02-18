import { z } from 'zod';
export declare const ContextSchema: z.ZodObject<{
    forWhom: z.ZodEnum<{
        me: "me";
        my_company: "my_company";
        client: "client";
    }>;
    companyName: z.ZodOptional<z.ZodString>;
    businessDescription: z.ZodString;
    industry: z.ZodOptional<z.ZodString>;
    employees: z.ZodOptional<z.ZodString>;
    revenue: z.ZodOptional<z.ZodString>;
    yearsInBusiness: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const DiscoveryInputSchema: z.ZodObject<{
    projectName: z.ZodString;
    context: z.ZodObject<{
        forWhom: z.ZodEnum<{
            me: "me";
            my_company: "my_company";
            client: "client";
        }>;
        companyName: z.ZodOptional<z.ZodString>;
        businessDescription: z.ZodString;
        industry: z.ZodOptional<z.ZodString>;
        employees: z.ZodOptional<z.ZodString>;
        revenue: z.ZodOptional<z.ZodString>;
        yearsInBusiness: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    problem: z.ZodString;
    desiredOutcome: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    currentProcess: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    availableData: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
export declare const EIIDMappingSchema: z.ZodObject<{
    enrichment: z.ZodObject<{
        existingData: z.ZodArray<z.ZodString>;
        missingData: z.ZodArray<z.ZodString>;
        sources: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
    inference: z.ZodObject<{
        patterns: z.ZodArray<z.ZodString>;
        predictions: z.ZodArray<z.ZodString>;
        anomalies: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
    interpretation: z.ZodObject<{
        insights: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
    delivery: z.ZodObject<{
        channels: z.ZodArray<z.ZodString>;
        triggers: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const StrategicAnalysisSchema: z.ZodObject<{
    industryContext: z.ZodString;
    valueMovement: z.ZodString;
    currentPosition: z.ZodString;
    targetPosition: z.ZodString;
    opportunities: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const DiscoveryResultSchema: z.ZodObject<{
    projectName: z.ZodString;
    context: z.ZodObject<{
        forWhom: z.ZodEnum<{
            me: "me";
            my_company: "my_company";
            client: "client";
        }>;
        companyName: z.ZodOptional<z.ZodString>;
        businessDescription: z.ZodString;
        industry: z.ZodOptional<z.ZodString>;
        employees: z.ZodOptional<z.ZodString>;
        revenue: z.ZodOptional<z.ZodString>;
        yearsInBusiness: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    problem: z.ZodString;
    desiredOutcome: z.ZodString;
    currentProcess: z.ZodArray<z.ZodString>;
    availableData: z.ZodArray<z.ZodString>;
    strategicAnalysis: z.ZodObject<{
        industryContext: z.ZodString;
        valueMovement: z.ZodString;
        currentPosition: z.ZodString;
        targetPosition: z.ZodString;
        opportunities: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
    eiidMapping: z.ZodObject<{
        enrichment: z.ZodObject<{
            existingData: z.ZodArray<z.ZodString>;
            missingData: z.ZodArray<z.ZodString>;
            sources: z.ZodArray<z.ZodString>;
        }, z.core.$strip>;
        inference: z.ZodObject<{
            patterns: z.ZodArray<z.ZodString>;
            predictions: z.ZodArray<z.ZodString>;
            anomalies: z.ZodArray<z.ZodString>;
        }, z.core.$strip>;
        interpretation: z.ZodObject<{
            insights: z.ZodArray<z.ZodString>;
        }, z.core.$strip>;
        delivery: z.ZodObject<{
            channels: z.ZodArray<z.ZodString>;
            triggers: z.ZodArray<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type ValidatedDiscoveryInput = z.infer<typeof DiscoveryInputSchema>;
export declare function validateInput(data: unknown): ValidatedDiscoveryInput;
export declare function getInputJsonSchema(): object;
//# sourceMappingURL=schema.d.ts.map
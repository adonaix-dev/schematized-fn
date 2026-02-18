import type { MaybePromise } from "@adonaix/types";

import type { StdSchemaV1 } from "~/Common/StdSchemaV1";
import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";
import type { SchematizedOutputArgs } from "~/Types/Function/SchematizedOutputArgs";

class SchematizedTuple<Args extends SchematizedArgsDefinition> {
    private readonly schemas: readonly StdSchemaV1[];
    private readonly restSchema: StdSchemaV1 | false;
    private readonly fixed: number;

    constructor(args: Args) {
        const last = args.at(-1) as StdSchemaV1 | readonly [StdSchemaV1];
        const restSchema = Array.isArray(last);

        this.restSchema = restSchema && last[0];
        this.fixed = (this.schemas = (
            restSchema ? args.slice(0, -1) : args
        ) as any).length;
    }

    private static compile(
        results: StdSchemaV1.Result<any>[],
    ): StdSchemaV1.Result<any[]> {
        const value: any[] = new Array(results.length);
        const issues: StdSchemaV1.Issue[] = [];

        for (let i = 0; i < results.length; i++) {
            const result = results[i]!;

            if (result.issues) {
                for (const issue of result.issues) {
                    issues.push({
                        ...issue,
                        path: [i, ...(issue.path || [])],
                    });
                }
            } else {
                value[i] = result.value;
            }
        }

        return issues.length ? { issues } : { value };
    }

    validate(args: any[]): MaybePromise<StdSchemaV1.Result<SchematizedOutputArgs<Args>>> {
        const results: MaybePromise<StdSchemaV1.Result<any>>[] = new Array(this.fixed);
        let isAsync = false;

        for (let i = 0; i < this.fixed; i++) {
            const result = this.schemas[i]!["~standard"].validate(args[i]);

            isAsync ||= result instanceof Promise;
            results[i] = result;
        }

        if (this.restSchema && args.length > this.fixed) {
            for (let i = this.fixed; i < args.length; i++) {
                const result = this.restSchema["~standard"].validate(args[i]);

                isAsync ||= result instanceof Promise;
                results.push(result);
            }
        }

        return (
            isAsync
                ? Promise.all(results).then(SchematizedTuple.compile)
                : SchematizedTuple.compile(results as StdSchemaV1.Result<any>[])
        ) as any;
    }
}

export { SchematizedTuple };

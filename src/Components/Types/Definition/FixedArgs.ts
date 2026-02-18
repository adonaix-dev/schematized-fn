import type { StdSchemaV1 } from "~/Common/StdSchemaV1";

import type { SchematizedArgsDefinition } from "./SchematizedArgsDefinition";

type FixedArgs<Args extends SchematizedArgsDefinition> = Args extends readonly [
    ...infer Arguments extends readonly StdSchemaV1[],
    readonly [StdSchemaV1],
]
    ? Arguments
    : Args;

export type { FixedArgs };

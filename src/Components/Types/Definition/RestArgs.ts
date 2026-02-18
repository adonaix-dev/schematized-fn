import type { StdSchemaV1 } from "~/Common/StdSchemaV1";

import type { SchematizedArgsDefinition } from "./SchematizedArgsDefinition";

type RestArgs<Args extends SchematizedArgsDefinition> = Args extends readonly [
    ...StdSchemaV1[],
    readonly [infer Rest],
]
    ? Rest extends StdSchemaV1
        ? Rest
        : never
    : null;

export type { RestArgs };

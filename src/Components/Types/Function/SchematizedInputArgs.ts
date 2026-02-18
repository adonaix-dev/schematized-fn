import type { StdSchemaV1 } from "~/Common/StdSchemaV1";
import type { FixedArgs } from "~/Types/Definition/FixedArgs";
import type { RestArgs } from "~/Types/Definition/RestArgs";
import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";

type MapToInput<Args extends SchematizedArgsDefinition> =
    FixedArgs<Args> extends infer Args extends readonly StdSchemaV1[]
        ? { -readonly [Key in keyof Args]: StdSchemaV1.InferInput<Args[Key]> }
        : never;

type SchematizedInputArgs<Args extends SchematizedArgsDefinition> =
    RestArgs<Args> extends infer Rest extends StdSchemaV1
        ? [...MapToInput<Args>, ...StdSchemaV1.InferInput<Rest>[]]
        : MapToInput<Args>;

export type { SchematizedInputArgs };

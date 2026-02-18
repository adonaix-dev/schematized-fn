import type { StdSchemaV1 } from "~/Common/StdSchemaV1";
import type { FixedArgs } from "~/Types/Definition/FixedArgs";
import type { RestArgs } from "~/Types/Definition/RestArgs";
import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";

type MapToOutput<Args extends SchematizedArgsDefinition> =
    FixedArgs<Args> extends infer Args extends readonly StdSchemaV1[]
        ? { -readonly [Key in keyof Args]: StdSchemaV1.InferOutput<Args[Key]> }
        : never;

type SchematizedOutputArgs<Args extends SchematizedArgsDefinition> =
    RestArgs<Args> extends infer Rest extends StdSchemaV1
        ? [...MapToOutput<Args>, ...StdSchemaV1.InferOutput<Rest>[]]
        : MapToOutput<Args>;

export type { SchematizedOutputArgs };

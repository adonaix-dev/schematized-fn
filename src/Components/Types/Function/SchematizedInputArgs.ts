import type { StdSchemaV1 } from "~/Common/StdSchemaV1";
import type { FixedArgs } from "~/Types/Definition/FixedArgs";
import type { RestArgs } from "~/Types/Definition/RestArgs";
import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";

type MapToInput<Args extends SchematizedArgsDefinition> =
    FixedArgs<Args> extends infer Args extends readonly StdSchemaV1[]
        ? { -readonly [Key in keyof Args]: StdSchemaV1.InferInput<Args[Key]> }
        : never;

/**
 * Represents the **input** arguments derived from a tuple of Standard
 * Schema V1 schemas. These are the types expected _before_
 * validation/transformation.
 *
 * @template Args The definition of the arguments schemas.
 */
type SchematizedInputArgs<Args extends SchematizedArgsDefinition> =
    RestArgs<Args> extends infer Rest extends StdSchemaV1
        ? [...MapToInput<Args>, ...StdSchemaV1.InferInput<Rest>[]]
        : MapToInput<Args>;

export type { SchematizedInputArgs };

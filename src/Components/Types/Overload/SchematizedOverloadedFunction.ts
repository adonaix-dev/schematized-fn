import type { UnionToIntersection } from "type-fest";

import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";
import type { SchematizedInputArgs } from "~/Types/Function/SchematizedInputArgs";

import type { SchematizedOverloadSignature } from "./SchematizedOverloadSignature";

type SchematizedOverloadedFunction<
    This,
    Overloads extends readonly SchematizedOverloadSignature[],
> = UnionToIntersection<
    {
        [Key in keyof Overloads]: Overloads[Key] extends SchematizedOverloadSignature<
            infer Args extends SchematizedArgsDefinition,
            infer Return
        >
            ? (this: This, ...args: SchematizedInputArgs<Args>) => Return
            : never;
    }[number]
>;

export type { SchematizedOverloadedFunction };

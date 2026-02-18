import type { UnionToIntersection } from "type-fest";

import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";
import type { SchematizedInputArgs } from "~/Types/Function/SchematizedInputArgs";

import type { SchematizedOverloadSignature } from "./SchematizedOverloadSignature";

/**
 * Represents the final **asynchronous** overloaded function type. All
 * overloads in this type return a `Promise`.
 *
 * @template This The type of the `this` context.
 * @template Overloads The list of registered overloads.
 */
type SchematizedOverloadedAsyncFunction<
    This,
    Overloads extends readonly SchematizedOverloadSignature[],
> = UnionToIntersection<
    {
        [Key in keyof Overloads]: Overloads[Key] extends SchematizedOverloadSignature<
            infer Args extends SchematizedArgsDefinition,
            infer Return
        >
            ? (this: This, ...args: SchematizedInputArgs<Args>) => Promise<Return>
            : never;
    }[number]
>;

export type { SchematizedOverloadedAsyncFunction };

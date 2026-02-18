import type { SchematizedOverloadedArgs } from "./SchematizedOverloadedArgs";
import type { SchematizedOverloadSignature } from "./SchematizedOverloadSignature";

/**
 * Determines the return type based on the matching overload for the
 * provided arguments.
 *
 * @template Overloads The list of registered overloads.
 * @template Args The arguments provided to the function.
 */
type SchematizedOverloadedReturn<
    Overloads extends readonly SchematizedOverloadSignature[],
    Args extends SchematizedOverloadedArgs<Overloads>,
> = Overloads extends readonly [
    infer First extends SchematizedOverloadSignature,
    ...infer Tail extends readonly SchematizedOverloadSignature[],
]
    ? Args extends First["args"]
        ? First["return"]
        : SchematizedOverloadedReturn<Tail, Args>
    : never;

export type { SchematizedOverloadedReturn };

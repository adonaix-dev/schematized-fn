import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";

import type { SchematizedOutputArgs } from "./SchematizedOutputArgs";

/**
 * Represents the **implementation** of a function that accepts
 * arguments validated by a schema.
 *
 * @template This The type of the `this` context.
 * @template Args The definition of the arguments schemas.
 * @template Return The return type of the function.
 */
type SchematizedImplementation<
    This = any,
    Args extends SchematizedArgsDefinition = SchematizedArgsDefinition,
    Return = any,
> = (this: This, ...args: SchematizedOutputArgs<Args>) => Return;

export type { SchematizedImplementation };

import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";

import type { SchematizedOutputArgs } from "./SchematizedOutputArgs";

type SchematizedImplementation<
    This = any,
    Args extends SchematizedArgsDefinition = SchematizedArgsDefinition,
    Return = any,
> = (this: This, ...args: SchematizedOutputArgs<Args>) => Return;

export type { SchematizedImplementation };

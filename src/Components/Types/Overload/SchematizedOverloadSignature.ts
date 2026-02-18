import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";
import type { SchematizedInputArgs } from "~/Types/Function/SchematizedInputArgs";

interface SchematizedOverloadSignature<
    Args extends SchematizedArgsDefinition = SchematizedArgsDefinition,
    Return = any,
> {
    args: SchematizedInputArgs<Args>;
    return: Return;
}

export type { SchematizedOverloadSignature };

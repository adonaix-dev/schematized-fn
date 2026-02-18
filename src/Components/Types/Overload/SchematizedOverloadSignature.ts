import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";
import type { SchematizedInputArgs } from "~/Types/Function/SchematizedInputArgs";

/**
 * Represents the structure of a single function overload signature.
 *
 * @template Args The definition of the arguments schemas.
 * @template Return The return type for this overload.
 */
interface SchematizedOverloadSignature<
    Args extends SchematizedArgsDefinition = SchematizedArgsDefinition,
    Return = any,
> {
    args: SchematizedInputArgs<Args>;
    return: Return;
}

export type { SchematizedOverloadSignature };

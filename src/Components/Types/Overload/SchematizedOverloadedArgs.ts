import type { SchematizedOverloadSignature } from "./SchematizedOverloadSignature";

/**
 * Represents the union of input argument types accepted by the
 * defined overloads.
 *
 * @template Overloads The list of registered overloads.
 */
type SchematizedOverloadedArgs<
    Overloads extends readonly SchematizedOverloadSignature[],
> = {
    [Key in keyof Overloads]: Overloads[Key]["args"];
}[keyof Overloads];

export type { SchematizedOverloadedArgs };

import type { SchematizedOverloadSignature } from "../SchematizedOverloadSignature";

type SchematizedOverloadedArgs<Overloads extends readonly SchematizedOverloadSignature[]> = {
    [Key in keyof Overloads]: Overloads[Key]["args"];
}[keyof Overloads];

export type { SchematizedOverloadedArgs };

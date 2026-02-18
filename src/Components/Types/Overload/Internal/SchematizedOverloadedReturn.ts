import type { SchematizedOverloadSignature } from "../SchematizedOverloadSignature";
import type { SchematizedOverloadedArgs } from "./SchematizedOverloadedArgs";

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

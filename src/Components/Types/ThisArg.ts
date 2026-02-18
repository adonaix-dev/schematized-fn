import type { missing } from "@adonaix/types";

type ThisArg<Type> = unknown extends Type ? void : Type extends missing ? void : Type;

export type { ThisArg };

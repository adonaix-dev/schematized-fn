import type { StdSchemaV1 } from "~/Common/StdSchemaV1";

type SchematizedArgsDefinition =
    | readonly StdSchemaV1[]
    | readonly [...StdSchemaV1[], readonly [StdSchemaV1]];

export type { SchematizedArgsDefinition };

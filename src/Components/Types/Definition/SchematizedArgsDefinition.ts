import type { StdSchemaV1 } from "~/Common/StdSchemaV1";

/**
 * Represents a definition for arguments.
 *
 * It can be a standard tuple of {@link StdSchemaV1 `StdSchemaV1`} (for
 * fixed arguments) or a tuple ending with a nested tuple
 * {@link StdSchemaV1 `[StdSchemaV1]`} (to represent a rest
 * parameter).
 */
type SchematizedArgsDefinition =
    | readonly StdSchemaV1[]
    | readonly [...StdSchemaV1[], readonly [StdSchemaV1]];

export type { SchematizedArgsDefinition };

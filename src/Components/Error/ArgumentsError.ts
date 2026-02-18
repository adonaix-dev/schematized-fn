import type { key } from "@adonaix/types";

import type { StdSchemaV1 } from "~/Common/StdSchemaV1";

import { SchematizedError } from "./SchematizedError";

/**
 * Error thrown when arguments fail validation against a schema.
 */
class ArgumentsError extends SchematizedError {
    override name = "ArgumentsError";

    /**
     * The list of validation issues encountered.
     */
    readonly issues!: readonly StdSchemaV1.Issue[];

    constructor(issues: readonly StdSchemaV1.Issue[]) {
        super(ArgumentsError.#format(issues));

        Object.defineProperty(this, "issues", {
            value: Object.freeze([...issues]),
            writable: false,
            configurable: true,
            enumerable: false,
        });
    }

    static #getKey(segment: key | StdSchemaV1.PathSegment): key {
        return typeof segment === "object" && segment !== null && "key" in segment
            ? segment.key
            : segment;
    }

    static #format(issues: readonly StdSchemaV1.Issue[]): string {
        const messages = issues.map((issue) => {
            const [location, ...insides] = issue.path ?? [];
            const key = ArgumentsError.#getKey(location!);
            const i = typeof key === "number" ? key : null;

            let placeOfOccurrence: string;

            if (i === null) placeOfOccurrence = "Unknown Argument";
            else {
                const inside = insides
                    .map((inside) => ArgumentsError.#getKey(inside).toString())
                    .join(".");

                placeOfOccurrence = `Argument at #${i}${inside ? ` at ${inside}` : ""}`;
            }

            return `${placeOfOccurrence}: ${issue.message}`;
        });

        return `failed to match to the provided arguments\n\t> ${messages.join("\n\t> ")}`;
    }
}

export { ArgumentsError };

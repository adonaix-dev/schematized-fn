import { SchematizedTuple } from "~/Core/Tuple/SchematizedTuple";
import { ArgumentsError } from "~/Error/ArgumentsError";
import { SynchronousValidationError } from "~/Error/SynchronousValidationError";
import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";
import type { SchematizedInputArgs } from "~/Types/Function/SchematizedInputArgs";
import type { SchematizedOutputArgs } from "~/Types/Function/SchematizedOutputArgs";

/**
 * A utility class for validating a list of arguments against a
 * defined tuple of Standard Schema V1 schemas.
 *
 * @template Args The definition of the arguments schemas.
 */
class SchematizedArgs<
    Args extends SchematizedArgsDefinition = SchematizedArgsDefinition,
> {
    readonly #schema: SchematizedTuple<Args>;

    private constructor(schema: Args) {
        this.#schema = new SchematizedTuple(schema);
    }

    /**
     * Creates a new {@link SchematizedArgs `SchematizedArgs`}
     * instance.
     *
     * @param schema The definition of the arguments schemas. To
     *   define a rest parameter, wrap the last schema in an array
     *   (e.g., `[z.string()]`, with `zod`).
     */
    static create<const As extends SchematizedArgsDefinition>(
        schema: As,
    ): SchematizedArgs<As> {
        return new SchematizedArgs(schema);
    }

    /**
     * Validates the provided arguments against the defined schemas
     * synchronously.
     *
     * @param args The input arguments to validate.
     *
     * @returns The validated and transformed output arguments.
     * @throws {SynchronousValidationError} If any schema requires
     *   asynchronous validation.
     * @throws {ArgumentsError} If validation fails.
     */
    parse(args: SchematizedInputArgs<Args>): SchematizedOutputArgs<Args> {
        const result = this.#schema.validate(args);

        if (result instanceof Promise) throw new SynchronousValidationError();
        if (result.issues) throw new ArgumentsError(result.issues);

        return result.value;
    }

    /**
     * Validates the provided arguments against the defined schemas
     * asynchronously.
     *
     * @param args The input arguments to validate.
     *
     * @returns A promise that resolves to the validated and
     *   transformed output arguments.
     * @throws {ArgumentsError} If validation fails.
     */
    async parseAsync(
        args: SchematizedInputArgs<Args>,
    ): Promise<SchematizedOutputArgs<Args>> {
        const result = await this.#schema.validate(args);

        if (result.issues) throw new ArgumentsError(result.issues);

        return result.value;
    }
}

export { SchematizedArgs };

import { SchematizedTuple } from "~/Core/Tuple/SchematizedTuple";
import { ArgumentsError } from "~/Error/ArgumentsError";
import { SynchronousValidationError } from "~/Error/SynchronousValidationError";
import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";
import type { SchematizedInputArgs } from "~/Types/Function/SchematizedInputArgs";
import type { SchematizedOutputArgs } from "~/Types/Function/SchematizedOutputArgs";

class SchematizedArgs<
    Args extends SchematizedArgsDefinition = SchematizedArgsDefinition,
> {
    readonly #schema: SchematizedTuple<Args>;

    private constructor(schema: Args) {
        this.#schema = new SchematizedTuple(schema);
    }

    static create<const As extends SchematizedArgsDefinition>(
        schema: As,
    ): SchematizedArgs<As> {
        return new SchematizedArgs(schema);
    }

    parse(args: SchematizedInputArgs<Args>): SchematizedOutputArgs<Args> {
        const result = this.#schema.validate(args);

        if (result instanceof Promise) throw new SynchronousValidationError();
        if (result.issues) throw new ArgumentsError(result.issues);

        return result.value;
    }

    async parseAsync(args: SchematizedInputArgs<Args>): Promise<SchematizedOutputArgs<Args>> {
        const result = await this.#schema.validate(args);

        if (result.issues) throw new ArgumentsError(result.issues);

        return result.value;
    }
}

export { SchematizedArgs };

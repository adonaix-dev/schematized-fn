import type { Assert } from "@adonaix/types";

import { SchematizedTuple } from "~/Core/Tuple/SchematizedTuple";
import { ArgumentsError } from "~/Error/ArgumentsError";
import { SynchronousValidationError } from "~/Error/SynchronousValidationError";
import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";
import type { SchematizedInputArgs } from "~/Types/Function/SchematizedInputArgs";
import type { SchematizedImplementation } from "~/Types/Function/SchematizedImplementation";
import type { ThisArg } from "~/Types/ThisArg";

class SchematizedFunction<
    This,
    Args extends SchematizedArgsDefinition = SchematizedArgsDefinition,
    Return = any,
> {
    readonly #schema: SchematizedTuple<Args>;
    readonly #implementation: SchematizedImplementation<This, Args, Return>;

    private constructor(
        schema: Args,
        implementation: SchematizedImplementation<This, Args, Return>,
    ) {
        this.#schema = new SchematizedTuple(schema);
        this.#implementation = implementation;
    }

    static create<const As extends SchematizedArgsDefinition, Return, This = void>(
        schema: As,
        implementation: SchematizedImplementation<This, As, Return>,
    ): SchematizedFunction<This, As, Return> {
        return new SchematizedFunction(schema, implementation);
    }

    apply(thisArg: ThisArg<This>, args: SchematizedInputArgs<Args>): Return {
        const result = this.#schema.validate(args);

        if (result instanceof Promise) throw new SynchronousValidationError();
        if (result.issues) throw new ArgumentsError(result.issues);

        return Reflect.apply(this.#implementation, thisArg, result.value);
    }

    async applyAsync(thisArg: ThisArg<This>, args: SchematizedInputArgs<Args>): Promise<Return> {
        const result = await this.#schema.validate(args);

        if (result.issues) throw new ArgumentsError(result.issues);

        return Reflect.apply(this.#implementation, thisArg, result.value);
    }

    call(thisArg: ThisArg<This>, ...args: SchematizedInputArgs<Args>): Return {
        return this.apply(thisArg, args);
    }

    async callAsync(thisArg: ThisArg<This>, ...args: SchematizedInputArgs<Args>): Promise<Return> {
        return await this.applyAsync(thisArg, args);
    }

    toFunction(): (this: ThisArg<This>, ...args: SchematizedInputArgs<Args>) => Return {
        const self = this;

        return function (this: any, ...args: any): Return {
            return self.apply(this, args);
        };
    }

    toAsyncFunction(): (
        this: ThisArg<This>,
        ...args: SchematizedInputArgs<Args>
    ) => Promise<Return> {
        const self = this;

        return async function (this: any, ...args: any): Promise<Return> {
            return await self.applyAsync(this, args);
        };
    }
}

export { SchematizedFunction };

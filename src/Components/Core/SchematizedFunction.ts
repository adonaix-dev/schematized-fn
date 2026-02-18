import { SchematizedTuple } from "~/Core/Tuple/SchematizedTuple";
import { ArgumentsError } from "~/Error/ArgumentsError";
import { SynchronousValidationError } from "~/Error/SynchronousValidationError";
import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";
import type { SchematizedImplementation } from "~/Types/Function/SchematizedImplementation";
import type { SchematizedInputArgs } from "~/Types/Function/SchematizedInputArgs";
import type { ThisArg } from "~/Types/ThisArg";

/**
 * Represents a function wrapper that automatically validates its
 * arguments using Standard Schema V1 schemas before execution.
 *
 * @template This The type of the `this` context.
 * @template Args The definition of the arguments schemas.
 * @template Return The return type of the function.
 */
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

    /**
     * Creates a new {@link SchematizedFunction `SchematizedFunction`}
     * instance.
     *
     * @param schema The definition of the arguments schemas. To
     *   define a rest parameter, wrap the last schema in an array.
     * @param implementation The implementation of the function.
     */
    static create<const As extends SchematizedArgsDefinition, Return, This = void>(
        schema: As,
        implementation: SchematizedImplementation<This, As, Return>,
    ): SchematizedFunction<This, As, Return> {
        return new SchematizedFunction(schema, implementation);
    }

    /**
     * Executes the function with the provided arguments and `this`
     * context, performing synchronous validation.
     *
     * @param thisArg The `this` context for the function execution.
     * @param args The input arguments to validate and pass to the
     *   function.
     *
     * @returns The return value of the implemented function.
     * @throws {SynchronousValidationError} If any schema requires
     *   asynchronous validation.
     * @throws {ArgumentsError} If validation fails.
     */
    apply(thisArg: ThisArg<This>, args: SchematizedInputArgs<Args>): Return {
        const result = this.#schema.validate(args);

        if (result instanceof Promise) throw new SynchronousValidationError();
        if (result.issues) throw new ArgumentsError(result.issues);

        return Reflect.apply(this.#implementation, thisArg, result.value);
    }

    /**
     * Executes the function with the provided arguments and `this`
     * context, performing asynchronous validation.
     *
     * @param thisArg The `this` context for the function execution.
     * @param args The input arguments to validate and pass to the
     *   function.
     *
     * @returns A promise resolving to the return value of the
     *   implemented function.
     * @throws {ArgumentsError} If validation fails.
     */
    async applyAsync(
        thisArg: ThisArg<This>,
        args: SchematizedInputArgs<Args>,
    ): Promise<Return> {
        const result = await this.#schema.validate(args);

        if (result.issues) throw new ArgumentsError(result.issues);

        return Reflect.apply(this.#implementation, thisArg, result.value);
    }

    /**
     * Calls the function with the provided arguments and `this`
     * context (spread syntax), performing synchronous validation.
     *
     * @param thisArg The `this` context.
     * @param args The input arguments.
     *
     * @returns The return value of the function.
     * @throws {SynchronousValidationError} If any schema requires
     *   asynchronous validation.
     * @throws {ArgumentsError} If validation fails.
     * @see {@link apply `apply()`}
     */
    call(thisArg: ThisArg<This>, ...args: SchematizedInputArgs<Args>): Return {
        return this.apply(thisArg, args);
    }

    /**
     * Calls the function with the provided arguments and `this`
     * context (spread syntax), performing asynchronous validation.
     *
     * @param thisArg The `this` context.
     * @param args The input arguments.
     *
     * @returns A promise resolving to the return value.
     * @throws {ArgumentsError} If validation fails.
     * @see {@link applyAsync `applyAsync()`}
     */
    async callAsync(
        thisArg: ThisArg<This>,
        ...args: SchematizedInputArgs<Args>
    ): Promise<Return> {
        return await this.applyAsync(thisArg, args);
    }

    /**
     * Bundles the validation schemas and the implementation into a
     * single synchronous closure.
     *
     * @returns A function that can be called directly.
     */
    toFunction(): (this: ThisArg<This>, ...args: SchematizedInputArgs<Args>) => Return {
        const self = this;

        return function (this: any, ...args: any): Return {
            return self.apply(this, args);
        };
    }

    /**
     * Bundles the validation schemas and the implementation into a
     * single asynchronous closure.
     *
     * @returns An async function that can be called directly.
     */
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

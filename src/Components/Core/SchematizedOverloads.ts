import { ArgumentsError } from "~/Error/ArgumentsError";
import { NoMatchingOverloadError } from "~/Error/NoMatchingOverloadError";
import { SynchronousValidationError } from "~/Error/SynchronousValidationError";
import type { SchematizedArgsDefinition } from "~/Types/Definition/SchematizedArgsDefinition";
import type { SchematizedImplementation } from "~/Types/Function/SchematizedImplementation";
import type { OverloadBranch } from "~/Types/Overload/Internal/OverloadBranch";
import type { SchematizedOverloadedArgs } from "~/Types/Overload/Internal/SchematizedOverloadedArgs";
import type { SchematizedOverloadedReturn } from "~/Types/Overload/Internal/SchematizedOverloadedReturn";
import type { SchematizedOverloadedAsyncFunction } from "~/Types/Overload/SchematizedOverloadedAsyncFunction";
import type { SchematizedOverloadedFunction } from "~/Types/Overload/SchematizedOverloadedFunction";
import type { SchematizedOverloadSignature } from "~/Types/Overload/SchematizedOverloadSignature";
import type { ThisArg } from "~/Types/ThisArg";

import { SchematizedTuple } from "./Tuple/SchematizedTuple";

class SchematizedOverloads<
    This,
    Overloads extends readonly SchematizedOverloadSignature[] = [],
> {
    #branches: OverloadBranch[];

    private constructor(...branches: OverloadBranch[]) {
        this.#branches = [...branches];
    }

    static create<This = void>(): SchematizedOverloads<This> {
        return new SchematizedOverloads();
    }

    prepend<const As extends SchematizedArgsDefinition, R>(
        schema: As,
        implementation: SchematizedImplementation<This, As, R>,
    ): SchematizedOverloads<This, [SchematizedOverloadSignature<As, R>, ...Overloads]> {
        return new SchematizedOverloads(
            {
                schema: new SchematizedTuple(schema),
                implementation,
            },
            ...this.#branches,
        );
    }

    append<const As extends SchematizedArgsDefinition, R>(
        schema: As,
        implementation: SchematizedImplementation<This, As, R>,
    ): SchematizedOverloads<This, [...Overloads, SchematizedOverloadSignature<As, R>]> {
        return new SchematizedOverloads(...this.#branches, {
            schema: new SchematizedTuple(schema),
            implementation,
        });
    }

    apply<As extends SchematizedOverloadedArgs<Overloads>>(
        thisArg: ThisArg<This>,
        args: As,
    ): SchematizedOverloadedReturn<Overloads, As> {
        const failures: (ArgumentsError | SynchronousValidationError)[] = [];

        for (const { schema, implementation } of this.#branches) {
            const result = schema.validate(args);

            if (result instanceof Promise)
                failures.push(new SynchronousValidationError());
            else if (result.issues) failures.push(new ArgumentsError(result.issues));
            else {
                return Reflect.apply(implementation, thisArg, result.value);
            }
        }

        throw new NoMatchingOverloadError(failures);
    }

    async applyAsync<As extends SchematizedOverloadedArgs<Overloads>>(
        thisArg: ThisArg<This>,
        args: As,
    ): Promise<SchematizedOverloadedReturn<Overloads, As>> {
        const failures: ArgumentsError[] = [];

        for (const { schema, implementation } of this.#branches) {
            const result = await schema.validate(args);

            if (result.issues) failures.push(new ArgumentsError(result.issues));
            else {
                return Reflect.apply(implementation, thisArg, result.value);
            }
        }

        throw new NoMatchingOverloadError(failures);
    }

    call<As extends SchematizedOverloadedArgs<Overloads>>(
        thisArg: ThisArg<This>,
        ...args: As
    ): SchematizedOverloadedReturn<Overloads, As> {
        return this.apply(thisArg, args);
    }

    async callAsync<As extends SchematizedOverloadedArgs<Overloads>>(
        thisArg: ThisArg<This>,
        ...args: As
    ): Promise<SchematizedOverloadedReturn<Overloads, As>> {
        return await this.applyAsync(thisArg, args);
    }

    toFunction(): SchematizedOverloadedFunction<This, Overloads> {
        const self = this;

        return function (this: any, ...args: any) {
            return self.apply(this, args);
        } as any;
    }

    toAsyncFunction(): SchematizedOverloadedAsyncFunction<This, Overloads> {
        const self = this;

        return async function (this: any, ...args: any) {
            return await self.applyAsync(this, args);
        } as any;
    }
}

export { SchematizedOverloads };

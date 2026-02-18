import { ArgumentsError } from "./ArgumentsError";
import { SchematizedError } from "./SchematizedError";
import type { SynchronousValidationError } from "./SynchronousValidationError";

class NoMatchingOverloadError extends SchematizedError {
    override name = "NoMatchingOverloadError";
    override readonly cause!: (ArgumentsError | SynchronousValidationError)[];

    constructor(failures: (ArgumentsError | SynchronousValidationError)[]) {
        super(
            `no overload signature matched the provided arguments\n${failures.reduce(
                (message, error, i) =>
                    `${message}\tOverload at #${i}: ${error.toString().replace(/\n/g, "\n\t")}\n`,
                "",
            )}\b`,
        );

        Object.defineProperty(this, "cause", {
            value: failures,
            writable: false,
            configurable: true,
            enumerable: false,
        });
    }
}

export { NoMatchingOverloadError };

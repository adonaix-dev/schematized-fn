import { SchematizedError } from "./SchematizedError";

/**
 * Error thrown when a synchronous validation method (e.g., `parse`,
 * `apply`) is called, but the underlying schema implementation
 * requires asynchronous validation (returns a Promise).
 */
class SynchronousValidationError extends SchematizedError {
    override readonly name = "SynchronousValidationError";

    constructor() {
        super(
            "failed to validate arguments synchronously. One or more schemas returned a Promise, but the current execution context requires a synchronous result",
        );
    }
}

export { SynchronousValidationError };

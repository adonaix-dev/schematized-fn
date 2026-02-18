import { SchematizedError } from "./SchematizedError";

class SynchronousValidationError extends SchematizedError {
    override readonly name = "SynchronousValidationError";

    constructor() {
        super(
            "failed to validate arguments synchronously. One or more schemas returned a Promise, but the current execution context requires a synchronous result",
        );
    }
}

export { SynchronousValidationError };

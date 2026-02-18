/**
 * Base error class for all errors thrown by `schematized-fn` package.
 */
abstract class SchematizedError extends Error {
    override name = "SchematizedError";
}

export { SchematizedError };

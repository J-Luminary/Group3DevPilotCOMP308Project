# Error Handling

## Don't swallow errors
A try/catch that only logs and returns null hides real bugs. Either handle the error meaningfully, rethrow, or don't catch at all. Every catch block should have a reason it exists.

## Fail fast
Validate inputs at the top of the function. If a required argument is missing, throw immediately. This produces clear error messages and prevents the function from running halfway before failing in a confusing way.

## Distinguish expected errors from bugs
Expected errors (validation failure, record not found) should be returned as structured data or typed errors. Unexpected errors (null dereference, out-of-memory) should crash loudly and be captured by a logger.

## Don't use exceptions for control flow
Throwing an exception to signal "not found" is slower and harder to read than returning null. Reserve exceptions for actual error conditions, not routine branching.

## Async errors
In async functions, unhandled promise rejections can silently drop requests. Always use try/catch around awaited calls in the top-level request handler, or register a global unhandledRejection handler.

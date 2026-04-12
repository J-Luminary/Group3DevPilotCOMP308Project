# Testing Strategy

## Pyramid, not hourglass
Most tests should be fast unit tests that exercise pure functions. A smaller number of integration tests should cover the interaction between modules. End-to-end tests are valuable but slow and brittle — keep them few and focused on critical user flows.

## Test behavior, not implementation
Tests should fail when the observable behavior of the code changes, not when the implementation is refactored. If a simple rename of a private function breaks your tests, the tests are coupled too tightly to the implementation.

## Deterministic tests
Flaky tests erode trust in the test suite. Eliminate sources of nondeterminism: random numbers, real clocks, real network calls, shared state between tests. Use fakes for time and randomness.

## Meaningful assertions
A test that asserts "result is not null" is barely a test. Assert the actual expected values. The point of a test is to catch regressions, which requires strict expectations.

## Test doubles
Mocks are for verifying interactions (was this function called?). Stubs are for providing canned answers (return this when called). Fakes are working but simplified implementations. Pick the weakest double that satisfies the test.

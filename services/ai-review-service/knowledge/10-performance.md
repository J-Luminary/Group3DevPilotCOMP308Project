# Performance Guidelines

## Measure before optimizing
Profile real workloads before touching code. Optimization based on guesses wastes effort and often makes things slower. Use a real profiler, not console.log timing.

## The N+1 query problem
The most common performance bug in backends: running one query in a loop over a list. A page that displays 50 projects with their owner names should make 2 queries (one for projects, one batched for owners), not 51.

## Cache at the right layer
Caching database reads, HTTP responses, and rendered HTML each have different tradeoffs. Cache as close to the consumer as possible without sacrificing correctness. Invalidate aggressively — stale data is a worse bug than slow data.

## Avoid synchronous work in the request path
Long-running tasks (sending emails, generating PDFs, calling slow third-party APIs) should be queued to a background worker. The user should not wait for work they do not care about.

## Bundle size matters
Every unused dependency in a frontend bundle is a tax on first load time. Tree-shake aggressively, lazy-load routes, and audit the bundle periodically. A 300 KB shave can cut seconds off load time on a 3G connection.

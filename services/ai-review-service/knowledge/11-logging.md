# Logging

## Structured logs
Emit logs as structured JSON, not free-form strings. A log entry should have timestamp, level, message, and any relevant IDs (request ID, user ID, resource ID). Structured logs are searchable and aggregatable; plain strings are not.

## Log levels
Use DEBUG for fine-grained internal state, INFO for normal operational events, WARN for recoverable problems that should be investigated, ERROR for unexpected failures that require attention. Do not log everything at INFO or the signal drowns in noise.

## Don't log secrets
Passwords, session tokens, API keys, and personally identifiable information should never appear in logs. Scrub these at the logging layer so a mistake in one call site does not leak sensitive data.

## Correlation IDs
Assign each incoming request a unique ID and attach it to every log line produced while handling that request. This makes it possible to reconstruct what happened for a single user across many services.

## Log volume
Logging is not free. Every log line consumes disk, network, and CPU. Logging inside a tight loop can become the dominant cost of the request. Log at the right granularity — once per meaningful event, not once per iteration.

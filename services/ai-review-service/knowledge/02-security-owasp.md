# Security Guidelines (OWASP Top 10)

## Injection
Never interpolate user input into queries. For MongoDB use parameterized queries through Mongoose models. For SQL use prepared statements. For shell commands use execFile with an argument array, never exec with a concatenated string.

## Broken Access Control
Every resolver or endpoint that touches user data must verify ownership. Checking "is the user logged in" is not enough — you must also check "does this specific user own this specific resource". Server-side checks only; never trust client-side filters.

## Cryptographic Failures
Never store passwords in plaintext. Use bcrypt or argon2 with a work factor of at least 10. Do not use MD5 or SHA1 for password hashing. Keep secrets in environment variables, never in source code or version control.

## Identification and Authentication Failures
Session cookies must be HttpOnly, Secure in production, and SameSite=Lax or Strict. Session IDs must be rotated on login to prevent session fixation. Do not put sensitive data in JWT payloads since they are only base64-encoded, not encrypted.

## Security Misconfiguration
Turn off GraphQL introspection in production. Do not expose stack traces to clients. Set appropriate CORS headers — never use a wildcard Access-Control-Allow-Origin with credentials enabled.

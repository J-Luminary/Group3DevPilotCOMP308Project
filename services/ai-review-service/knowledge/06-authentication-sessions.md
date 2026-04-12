# Authentication with Sessions

## Why session cookies
Server-side sessions with HttpOnly cookies are safer than JWTs stored in localStorage. LocalStorage is readable by any JavaScript running on the page, making it vulnerable to XSS exfiltration. HttpOnly cookies cannot be read by JS and are immune to that class of attack.

## Session store
The session store must be shared across all services that need to read the session. An in-memory store like the default MemoryStore only works for a single-process server. Use MongoDB, Redis, or another external store for production.

## Cookie flags
Set httpOnly to block JS access. Set secure: true in production to require HTTPS. Set sameSite: "lax" for most apps, or "strict" for high-security use cases where cross-site requests should never carry the cookie. Never use "none" without also setting secure: true.

## CSRF protection
Session-cookie auth is vulnerable to CSRF. Mitigate with SameSite=Lax (which blocks most cross-site form submissions) and, for sensitive mutations, a CSRF token tied to the session.

## Logout
Logging out must destroy the session on the server, not just clear the cookie in the browser. If only the cookie is cleared, the session remains valid and can be replayed by anyone who captured it.

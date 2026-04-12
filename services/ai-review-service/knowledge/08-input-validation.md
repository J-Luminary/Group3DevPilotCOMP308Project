# Input Validation

## Validate at the boundary
Validate all input at the edge of your system (the resolver, the REST handler, the message queue consumer). Once data has passed validation, the inner layers can trust it. Re-validating everywhere adds noise without adding safety.

## Whitelist, don't blacklist
Define what is allowed, not what is forbidden. A whitelist of allowed characters in a username is stronger than a blacklist of banned ones — attackers will always find a character you did not think of.

## Use a schema library
Zod, Yup, Joi, or similar. Hand-rolled validators drift out of sync with the types and miss edge cases. A schema library keeps the validation rules in one place and produces consistent error messages.

## Validate types AND semantics
A string might pass the type check but still be a malformed email or a negative number where a positive is expected. Enforce semantic rules (length, format, range) alongside type rules.

## Trust nothing from the network
Even requests from your own frontend can be tampered with by anyone running the browser. Never skip validation because "the client already checks this". Client-side validation is a UX feature, not a security one.

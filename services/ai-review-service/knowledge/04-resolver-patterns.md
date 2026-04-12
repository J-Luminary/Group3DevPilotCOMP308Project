# Resolver Design Patterns

## Thin resolvers, fat services
Resolvers should be thin. They should extract arguments, call a service function, and return the result. All business logic belongs in plain JavaScript modules that can be tested independently of the GraphQL layer.

## Context for authentication
Pass the authenticated user through the GraphQL context. Do not pass request or response objects to business logic — extract what you need (user ID, session, locale) and pass only that.

## Error handling
Throw typed GraphQL errors with codes that clients can react to. Generic "Error" throws lose information on the way to the client. Use error extensions to include machine-readable codes like UNAUTHENTICATED, FORBIDDEN, NOT_FOUND.

## Avoid side effects in query resolvers
Query resolvers should be pure reads. Writes belong in mutation resolvers. Mixing the two breaks caching and confuses consumers.

## Batch expensive lookups
When a resolver for a list field triggers a database call per item, wrap it with DataLoader so concurrent calls are batched. This is the single biggest performance win for most GraphQL backends.

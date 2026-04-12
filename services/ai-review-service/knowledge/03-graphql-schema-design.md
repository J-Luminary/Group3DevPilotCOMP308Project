# GraphQL Schema Design

## Use types, not strings
Prefer strong GraphQL types over String for structured data. A Money type with amount and currency is better than "$12.50" as a string. Clients benefit from the type system; stringly-typed APIs push parsing into every consumer.

## Nullability
Mark fields as non-null (!) only when the backend can guarantee them. An over-aggressive non-null schema will crash entire queries if one field returns null due to an unexpected edge case.

## Pagination
Always paginate list fields that could grow unbounded. Cursor-based pagination (Relay-style connections) scales better than offset pagination for large datasets. For small finite lists (user's own projects), simple arrays are acceptable.

## Mutations
Mutation names should be verbs: createProject, updateUser, deletePost. Mutations should return the affected object, not just a boolean. This lets clients update their cache without a refetch.

## N+1 problem
Avoid the N+1 query problem by batching database reads. Use DataLoader or equivalent to coalesce parallel field lookups into a single query.

## Federation
In federated schemas, each subgraph owns a subset of types. Use @key to identify types that cross subgraph boundaries. A type can be extended in multiple subgraphs but should be owned by one.

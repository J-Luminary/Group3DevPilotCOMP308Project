# MongoDB Data Modeling

## Embed vs reference
Embed when the child data is owned by the parent and rarely queried on its own. Reference when the child is shared, queried independently, or unbounded in size. A project's feature list can be embedded; a project's users (shared) should be referenced.

## Avoid unbounded arrays
MongoDB documents have a 16 MB cap. An array that grows without limit (comments on a viral post, log entries) will eventually hit the cap. Use a separate collection with a reference back to the parent for these cases.

## Indexes
Every field used in a query filter or sort should have an index. Missing indexes turn into full collection scans and are the most common cause of slow Mongo apps. Check query performance with explain().

## Denormalization
Duplicating data across documents is acceptable when it avoids expensive joins. The tradeoff is that updates must propagate to all copies. Denormalize read-heavy data that rarely changes (a user's display name cached on their posts).

## Schema validation
Use Mongoose schemas or Mongo's native schema validation to enforce required fields and types. Schemaless does not mean no schema — it means the schema lives in your application code and should still be explicit.

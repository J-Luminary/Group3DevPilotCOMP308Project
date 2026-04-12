# Coding Standards

## Naming
Use camelCase for variables and functions. Use PascalCase for classes and React components. Constants that never change should be UPPER_SNAKE_CASE. File names should match what they export: a file exporting a React component called UserCard should be UserCard.jsx.

## Function length
Keep functions under 40 lines. If a function gets longer, it is usually doing more than one thing and should be split. Each function should have one clear responsibility that can be stated in a single sentence.

## Nesting
Avoid nesting logic more than 3 levels deep. Early returns (guard clauses) flatten the code. Example: instead of wrapping the happy path in multiple if blocks, check preconditions and return early on failure.

## Comments
Do not comment obvious code. Comment the "why", not the "what". If the code needs a comment to explain what it does, consider renaming variables or extracting a helper with a descriptive name instead.

## Magic numbers
Never use raw numbers in business logic. Extract them into named constants so the meaning is explicit and the value can be changed in one place.

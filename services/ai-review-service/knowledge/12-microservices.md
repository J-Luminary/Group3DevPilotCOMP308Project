# Microservices and Boundaries

## Separate by data ownership
Split services along boundaries of data ownership, not along technical layers. An "auth service" that owns users and sessions is a good boundary. A "controllers service" and a "models service" is not — that is horizontal slicing and forces every change to touch multiple services.

## API Gateway
A gateway unifies multiple backend services behind a single endpoint for clients. The gateway should be thin: authentication forwarding, request routing, response shaping. Business logic in the gateway creates a monolith with extra network hops.

## Independent deployability
If deploying service A always requires deploying service B at the same time, they are not really separate services. They are a distributed monolith. Pay attention to interface compatibility across versions.

## Asynchronous communication
Direct HTTP calls between services create tight runtime coupling — if service B is down, service A fails. Asynchronous messaging (events, queues) decouples services and makes the system more resilient, at the cost of eventual consistency.

## Don't microservice too early
A small team with a small product should start as a monolith. Microservices add operational complexity (deployment, monitoring, networking, debugging) that is only worth paying for when the team has grown past what a single codebase can support.

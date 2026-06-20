<!--
SYNC IMPACT REPORT
- Version change: None -> 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Controller-Service Separation
  - [PRINCIPLE_2_NAME] -> II. Strict Zod Type Safety
  - [PRINCIPLE_3_NAME] -> III. Centralized Custom Error Handling
  - [PRINCIPLE_4_NAME] -> IV. Single Prisma Client Adapter Access
  - [PRINCIPLE_5_NAME] -> V. Isolated Authentication Governance
- Added sections:
  - Technology Stack & Tooling Constraints
  - Quality Gates & Review Process
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated)
  - .specify/templates/spec-template.md (✅ updated)
  - .specify/templates/tasks-template.md (✅ updated)
- Follow-up TODOs: None
-->

# macroPro Constitution

## Core Principles

### I. Controller-Service Separation
Route files (`src/routes/*`) MUST only define metadata, endpoints, and Zod validation schemas. Controllers (`src/controllers/*`) MUST handle HTTP-specific logic, session validation via better-auth, and request data extraction. Services (`src/services/*`) MUST contain all business logic, interact with Prisma, and return domain data or raise domain-specific errors.

### II. Strict Zod Type Safety
Every Fastify route definition MUST use Zod schemas (using `fastify-type-provider-zod`) for query parameters, route parameters, request bodies, and responses. Ad-hoc or untyped request bodies are strictly forbidden. Type safety must cascade from schemas directly to controller parameters using DTOs or derived TypeScript types.

### III. Centralized Custom Error Handling
All operational errors MUST inherit from the base `AppError` class and utilize explicit HTTP status codes (e.g., `NotFoundError` for 404, `BadRequestError` for 400). Direct HTTP response manipulation or throwing generic raw `Error` objects for business failures is disallowed. Errors must format according to the global `errorResponseSchema`.

### IV. Single Prisma Client Adapter Access
Database persistence operations MUST interact through a single, shared Prisma client instance configured with PostgreSQL adapter located in `src/lib/prismaClient.ts`. Direct raw SQL executions or multiple PrismaClient instantiations are prohibited.

### V. Isolated Authentication Governance
User authentication and session verification MUST rely on `better-auth`. Session lookup MUST be handled in controller handlers using headers converted through `fromNodeHeaders()`. Services and controllers must treat authenticated user IDs as non-nullable security contexts.

## Technology Stack & Tooling Constraints
The core tech stack is composed of Fastify (v5+), PostgreSQL, Prisma ORM, Better-Auth, and TypeScript (v6+). Development and hot reloading MUST run via `tsx --watch src/server.ts`. Code compile-time checks are executed using `tsc`. APIs must be documented using Scalar API Reference via `/api-docs` path.

## Quality Gates & Review Process
1. **Route Schemas**: Any new endpoint must specify response schemas for successful outcomes (200/201) and errors (400/401/404/409/500).
2. **TypeScript Compilation**: The project must build successfully using `npm run build` without any TypeScript errors.
3. **Lint & Security**: Sensitive keys and database connection strings must reside in `.env` and never be committed to git.

## Governance
1. **Constitutional Supremacy**: This document defines the engineering standards for the `macroPro` codebase. Any implementation plan or pull request must respect these core principles.
2. **Amendments**: Modifying this constitution requires bumping the constitution version (`CONSTITUTION_VERSION`) in accordance with semantic versioning. Major versions represent structural changes to principles, minor version changes add guidance, and patch versions fix typos or formatting.
3. **Compliance Checklist**: Reviewers must check for compliance with Controller-Service Separation, Zod validation, and error class standards.

**Version**: 1.0.0 | **Ratified**: 2026-06-20 | **Last Amended**: 2026-06-20

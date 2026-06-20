# Implementation Plan: Nutrition Tracker

**Branch**: `001-nutrition-tracker` | **Date**: 2026-06-20 | **Spec**: [spec.md](file:///d:/meus%20projetos/macroPro/specs/001-nutrition-tracker/spec.md)

**Input**: Feature specification from `/specs/001-nutrition-tracker/spec.md`

## Summary

Build an API/backend for a calorie and macronutrient tracking system (macroPro) where users manage their physical profiles, define intake targets, maintain a shared food catalog, log daily meals with proportional nutrient calculations, and track target vs. consumed balances via a daily dashboard.

## Technical Context

**Language/Version**: TypeScript v6+

**Primary Dependencies**: Fastify (v5+), fastify-type-provider-zod, better-auth, zod

**Storage**: PostgreSQL, Prisma ORM

**Testing**: (Not requested, testing tasks are optional)

**Target Platform**: Node.js v20+ / Windows development environment

**Project Type**: web-service (REST API using Fastify)

**Performance Goals**: Dashboard updates within 1s of food logging.

**Constraints**: Controller-Service Separation, Zod validation, single Prisma client.

**Scale/Scope**: 1:1 user-profile relationship, shared food catalog, date-grouped meals.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Rule 1 (Controller-Service Separation)**: Routes register schemas. Controllers handle request/response wrapper and auth checks. Services handle prisma database operations and math. (Status: ✅ Pass)
- **Rule 2 (Strict Zod Type Safety)**: Every route body, parameters, query, and response code must have a Zod schema. (Status: ✅ Pass)
- **Rule 3 (Centralized Custom Error Handling)**: AppError and subclasses are thrown. All routes return standardized errorResponseSchema on failure. (Status: ✅ Pass)
- **Rule 4 (Single Prisma Client Adapter Access)**: Use the shared `prisma` client from `src/lib/prismaClient.ts`. (Status: ✅ Pass)
- **Rule 5 (Isolated Authentication Governance)**: Authenticate with `better-auth` using session verification in controllers. (Status: ✅ Pass)

## Project Structure

### Documentation (this feature)

```text
specs/001-nutrition-tracker/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
```

### Source Code (repository root)

```text
src/
├── controllers/
│   ├── food/
│   │   └── createFoodController.ts   # [NEW]
│   │   └── listFoodsController.ts    # [NEW]
│   ├── meal/
│   │   └── createMealController.ts   # [NEW]
│   │   └── addFoodToMealController.ts # [NEW]
│   │   └── deleteMealController.ts   # [NEW]
│   │   └── getDashboardController.ts # [NEW]
│   └── userProfile/                  # Existing controllers
├── services/
│   ├── food/
│   │   └── createFoodService.ts      # [NEW]
│   │   └── listFoodsService.ts       # [NEW]
│   ├── meal/
│   │   └── createMealService.ts      # [NEW]
│   │   └── addFoodToMealService.ts   # [NEW]
│   │   └── deleteMealService.ts      # [NEW]
│   │   └── getDashboardService.ts    # [NEW]
│   └── userProfile/                  # Existing services
├── routes/
│   ├── foodRoute.ts                  # [MODIFY]
│   ├── mealRoute.ts                  # [NEW]
│   └── userProfileRoute.ts           # Existing routes
├── shared/
│   ├── schemas/
│   │   ├── foodSchema.ts             # [NEW] Replaces/renames foodSchem.ts if needed
│   │   └── mealSchema.ts             # [NEW]
│   └── models/
│       ├── foodModel.ts              # [NEW]
│       └── mealModel.ts              # [NEW]
```

**Structure Decision**: Single project layout matching existing structure under `src/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. Compliance with all core principles is maintained.

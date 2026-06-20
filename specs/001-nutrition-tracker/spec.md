# Feature Specification: Nutrition Tracker

**Feature Branch**: `001-nutrition-tracker`

**Created**: 2026-06-20

**Status**: Draft

**Input**: User description: "Construa uma aplicação que ajude os usuários a criar, gerenciar e monitorar suas metas diárias de ingestão calórica e macronutrientes com base em seus perfis físicos e objetivos..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Physical Profile and Nutrition Targets (Priority: P1)

Users can configure their physical profile and set their daily calorie and macronutrient targets.

**Why this priority**: Crucial first step for establishing goals and personalized tracking.

**Independent Test**: Verify that a user can create and retrieve a unique profile with stats and macro goals.

**Acceptance Scenarios**:
1. **Given** a user has no profile, **When** they create their profile with age, gender, weight, height, activity level, goal, daily calories, and macronutrient targets, **Then** their unique profile is created and goals are set.
2. **Given** a user has an existing profile, **When** they update their weight or height, **Then** their profile details are updated accordingly.

---

### User Story 2 - Food Catalog Management (Priority: P1)

Users can contribute to and browse a shared catalogue of foods with nutritional values defined per 100g base.

**Why this priority**: Logged meals depend on having a shared, reusable directory of food items.

**Independent Test**: Verify that a food item can be added to the catalog and is retrievable by any user.

**Acceptance Scenarios**:
1. **Given** a user wants to register a new food, **When** they input its name and nutritional values (calories, protein, carbs, fat per 100g base), **Then** the food is saved and available to all users.
2. **Given** the food catalog, **When** a user searches or lists foods, **Then** the system returns the registered items.

---

### User Story 3 - Daily Meal Logging (Priority: P1)

Users can log meals on specific dates, add foods with consumed grams to those meals, and delete meals.

**Why this priority**: Core interaction for tracking daily intake.

**Independent Test**: Verify a user can create a meal, associate foods with specific gram weights, and delete a meal causing cascade deletion of items.

**Acceptance Scenarios**:
1. **Given** a user wants to log food intake, **When** they create a meal with a name (e.g., "Almoço") for a specific date, **Then** the empty meal is registered for that user on that date.
2. **Given** a registered meal, **When** the user adds a food from the catalog specifying 150 consumed grams, **Then** the food is associated with the meal at that specific weight.
3. **Given** a meal containing multiple foods, **When** the user deletes that meal, **Then** the meal and all its food items are cascadingly deleted.

---

### User Story 4 - Daily Nutrition Dashboard (Priority: P2)

Users can view a comparative overview of their daily targets vs. actual consumption vs. remaining nutrients for a specific date.

**Why this priority**: Essential feedback loop for monitoring nutrition progress.

**Independent Test**: Verify that the daily summary correctly computes scaled macro/calorie values and tracks remaining balance.

**Acceptance Scenarios**:
1. **Given** a user has logged meals on a specific date, **When** they retrieve the summary for that date, **Then** the system calculates actual intake by scaling food values proportionally:
   $$\text{Nutriente Consumido} = \frac{\text{Nutriente do Alimento} \times \text{consumedGrams}}{100}$$
2. **Given** the calculated intake, **When** compiling the summary, **Then** the response details: Meta Total, Total Consumido, and Restante (Meta - Consumido) for calories, carbs, protein, and fat.

---

### Edge Cases

- **Negative Weights or Nutrients**: The system MUST reject attempts to register food items with negative nutritional content or log meals with zero or negative `consumedGrams`.
- **Resource Ownership**: Users MUST NOT be allowed to view, modify, or delete meals, profiles, or log entries created by other users.
- **Duplicate Profiles**: If a user attempts to create a physical profile when one already exists, the system MUST return a conflict error and recommend modifying the existing profile instead.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow each user to have exactly one health/physical profile containing age, gender, weight, height, activity level, and health goal.
- **FR-002**: The system MUST allow users to register daily targets for calories, carbs, protein, and fat manually.
- **FR-003**: The system MUST implement a temporary static calculation fallback for daily targets if they are not provided manually.
- **FR-004**: The system MUST maintain a shared, reusable food catalog specifying calorie/macro content per 100g base.
- **FR-005**: The system MUST support meal creation by name linked to a specific date for a authenticated user.
- **FR-006**: The system MUST allow adding foods to meals with custom weight in grams (`consumedGrams`).
- **FR-007**: Deleting a meal MUST automatically perform a cascade deletion of all its meal-food items.
- **FR-008**: The system MUST calculate proportional calorie and macro values for logged meal foods using a 100g base reference.
- **FR-009**: The system MUST calculate and return daily dashboard comparisons showing: Goal vs. Consumed vs. Remaining.

### Key Entities

- **User**: The authenticated actor.
- **UserProfile**: Physical profile and target macros linked 1:1 to a User.
- **Food**: Reusable catalog item storing nutrient values per 100g.
- **Meal**: Logged container with a name and date, owned by a User.
- **MealFood**: Junction entity containing the food link and the consumed grams.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see their daily dashboard updated with new totals within 1 second of logging a new food item.
- **SC-002**: Deleting a meal successfully cleans up all related meal-food records in the database with 100% integrity.
- **SC-003**: Ingested calorie/macro math matches proportional formulas with zero precision drift beyond two decimal places.

## Assumptions

- Authenticated user context is managed by the system's authentication layer (`better-auth`).
- The base weight unit for catalog items is strictly grams, with a base weight reference of 100g.
- Dates are tracked in local or standard ISO timezone without time components for daily aggregation.

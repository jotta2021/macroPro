# Quickstart & Verification Guide: Nutrition Tracker

This guide details how to verify the end-to-end functionality of the calorie and macro tracker.

## Setup and Server Start

1. **Verify environment and database connection**:
   Ensure database configuration resides in `.env`:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/macropro"
   PORT=3000
   ```

2. **Run database migrations and code generation**:
   ```bash
   # Push Prisma schema to database and generate Client
   npx prisma db push
   npx prisma generate
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The dev server will boot on `http://localhost:3000`. Open the API Reference docs at `http://localhost:3000/api-docs`.

---

## Verification Scenarios

You can verify all endpoints using curl or a REST tool like Postman.

### Scenario 1: Configure User Profile & Targets
1. Send a POST request to `/profile` with a JSON body representing your physical stats. Leave target macros as null to verify the static formula calculation:
   ```bash
   curl -X POST http://localhost:3000/profile \
     -H "Content-Type: application/json" \
     -d '{"age": 30, "gender": "MALE", "weight": 70, "height": 175, "activityLevel": "MODERATE", "goal": "HYPERTROPHY"}'
   ```
2. Verify the response contains calculated target metrics:
   - Daily calories target calculated based on Mifflin-St Jeor + TDEE multiplier (1.55) + Hypertrophy surplus (500).
   - Protein target: $70 \times 2.0 = 140\text{g}$.
   - Fat target: $70 \times 1.0 = 70\text{g}$.
   - Carbs target: Remaining calories balance divided by 4.

### Scenario 2: Register Foods in Catalog
1. Add a food item (e.g. Oats, 389 kcal per 100g base):
   ```bash
   curl -X POST http://localhost:3000/foods \
     -H "Content-Type: application/json" \
     -d '{"name": "Aveia", "calories": 389, "carbo": 66, "protein": 16.9, "fat": 6.9, "baseGrams": 100}'
   ```
2. Verify the response yields a valid UUID of the created food:
   ```json
   { "id": "food-uuid" }
   ```

### Scenario 3: Log Meal Intake
1. Create a meal container for today:
   ```bash
   curl -X POST http://localhost:3000/meals \
     -H "Content-Type: application/json" \
     -d '{"name": "Café da Manhã", "date": "2026-06-20T00:00:00.000Z"}'
   ```
   Save the returned `meal-uuid`.

2. Log the consumption of 50g of Aveia:
   ```bash
   curl -X POST http://localhost:3000/meals/meal-uuid/foods \
     -H "Content-Type: application/json" \
     -d '{"foodId": "food-uuid", "consumedGrams": 50}'
   ```

### Scenario 4: Request Daily Dashboard
1. Fetch the daily comparison dashboard:
   ```bash
   curl http://localhost:3000/meals/dashboard/2026-06-20
   ```
2. Verify that:
   - `goals` match the targets configured in the profile.
   - `consumed` values are exactly half ($50\text{g} / 100\text{g}$) of the Oats nutrition profiles (Oats per 100g base).
   - `remaining` matches `goals` minus `consumed`.

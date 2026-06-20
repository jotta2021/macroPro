# Research and Decision Log: Nutrition Tracker

## Decision 1: Static Target Calorie and Macronutrient Calculation Formula

### Context
If a user registers a profile but does not supply manual calorie and macronutrient targets, the system must perform a temporary static calculation.

### Chosen Formula: Mifflin-St Jeor & Standard Macro Splits
1. **Basal Metabolic Rate (BMR)**:
   - Male (default if null):
     $$BMR = (10 \times \text{weight}) + (6.25 \times \text{height}) - (5 \times \text{age}) + 5$$
   - Female:
     $$BMR = (10 \times \text{weight}) + (6.25 \times \text{height}) - (5 \times \text{age}) - 161$$
   - *Note: If age is null, fallback BMR calculation uses age = 25.*
2. **Total Daily Energy Expenditure (TDEE)**:
   - `SEDENTARY`: $TDEE = BMR \times 1.2$
   - `MODERATE`: $TDEE = BMR \times 1.55$
   - `INTENSE`: $TDEE = BMR \times 1.9$
3. **Goal Adjustment (Daily Target Calories)**:
   - `WEIGHTLOSS`: $\text{Daily Calories} = TDEE - 500$ (bounded to a minimum of 1200 kcal)
   - `MAINTENANCE`: $\text{Daily Calories} = TDEE$
   - `HYPERTROPHY`: $\text{Daily Calories} = TDEE + 500$
4. **Macronutrient Split**:
   - **Protein**: $2.0 \times \text{weight}$ in grams (4 kcal/g). Bounded to a maximum of $45\%$ of total calories.
   - **Fat**: $1.0 \times \text{weight}$ in grams (9 kcal/g). Bounded to a maximum of $35\%$ and minimum of $15\%$ of total calories.
   - **Carbo**: $\frac{\text{Daily Calories} - (\text{Protein} \times 4) - (\text{Fat} \times 9)}{4}$ in grams. Bounded to a minimum of $50\text{g}$.

### Rationale
Mifflin-St Jeor is the current industry gold standard for calculating BMR. Macro ratios prioritizing high protein (2.0g/kg) and moderate fat (1.0g/kg) are widely accepted for fitness, hypertrophy, and weight loss.

---

## Decision 2: Prisma Schema and Relations for Cascade Deletions

### Context
When deleting a `Meal`, all its associated `MealFood` items must be cascadingly deleted to avoid orphaned rows.

### Analysis of Current schema.prisma
```prisma
model MealFood {
  id            String @id @default(uuid())
  mealId        String
  foodId        String
  consumedGrams Float
  food          Food   @relation(fields: [foodId], references: [id])
  meal          Meal   @relation(fields: [mealId], references: [id], onDelete: Cascade)
}
```
The existing database schema in `prisma/schema.prisma` already defines the relation `meal Meal @relation(fields: [mealId], references: [id], onDelete: Cascade)`.

### Action
Database cascade deletes are already configured at the Prisma layer. We do not need to perform manual cascade cleanup in our services; calling `prisma.meal.delete` will automatically trigger database-level deletion of all associated `MealFood` entries.

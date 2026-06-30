import z from "zod";
import { MealType } from "../../../generated/prisma/enums.js";

/**
 * model Meal {
  id     String     @id @default(uuid())
  userId String
  name   String
  date   DateTime   @default(now())
  user   User       @relation(fields: [userId], references: [id])
  items  MealFood[]

  @@index([userId, date])
}

model MealFood {
  id            String @id @default(uuid())
  mealId        String
  foodId        String
  consumedGrams Float
  food          Food   @relation(fields: [foodId], references: [id])
  meal          Meal   @relation(fields: [mealId], references: [id], onDelete: Cascade)
}
 */
export const CreateMealsSchema = z.object({
  type: z.enum(MealType),
  date: z.coerce.date(),
  items: z.array(
    z.object({
      foodId: z.string(),
      consumedGrams: z.number().nonnegative(),
    }),
  ),
});

export const UpdateMealsParamsSchema = z.object({
  id: z.string().uuid("Invalid meal ID format"),
});

export const UpdateMealsSchema = z.object({
  type: z.enum(MealType),
  date: z.coerce.date(),
  items: z.array(
    z.object({
      foodId: z.string(),
      consumedGrams: z
        .number()
        .positive("Consumed grams must be greater than zero"),
    }),
  ),
});

export const MealItemResponseSchema = z.object({
  id: z.string(),
  mealId: z.string(),
  foodId: z.string(),
  consumedGrams: z.number(),
  food: z.object({
    id: z.string(),
    name: z.string(),
    calories: z.number(),
    carbo: z.number(),
    protein: z.number(),
    fat: z.number(),
    baseGrams: z.number(),
  }),
});

export const MealResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(MealType),
  date: z.date(),
  items: z.array(MealItemResponseSchema),
});

export const ListMealsResponseSchema = z.array(MealResponseSchema);

export const GetMealParamsSchema = z.object({
  id: z.string().uuid("Invalid meal ID format"),
});

export const DailySummaryQuerySchema = z.object({
  date: z.coerce.date(),
});

export const DailySummaryResponseSchema = z.object({
  dailySummary: z.object({
    caloriesTarget: z.number(),
    caloriesConsumed: z.number(),
    proteinTarget: z.number(),
    proteinConsumed: z.number(),
    carboTarget: z.number(),
    carboConsumed: z.number(),
    fatTarget: z.number(),
    fatConsumed: z.number(),
  }),
  meals: z.array(
    z.object({
      type: z.enum(MealType),
      mealId: z.string().optional(),
      caloriesTarget: z.number(),
      caloriesConsumed: z.number(),
      proteinConsumed: z.number(),
      carboConsumed: z.number(),
      fatConsumed: z.number(),
      items: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          grams: z.number(),
          calories: z.number(),
          protein: z.number(),
          carbo: z.number(),
          fat: z.number(),
        }),
      ),
    }),
  ),
});

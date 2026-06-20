import z from "zod";

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
  name: z.string(),
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
  name: z.string().min(1, "Name is required"),
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
  name: z.string(),
  date: z.date(),
  items: z.array(MealItemResponseSchema),
});

export const ListMealsResponseSchema = z.array(MealResponseSchema);

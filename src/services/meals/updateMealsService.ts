import prisma from "../../lib/prismaClient.js";
import { updateMealsModel } from "../../shared/models/mealsModels.js";
import { NotFoundError, UnauthorizedError } from "../../errors/index.js";

export class UpdateMealsService {
  async execute(id: string, body: updateMealsModel, userId: string) {
    const existingMeal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!existingMeal) {
      throw new NotFoundError("Meal not found");
    }

    if (existingMeal.userId !== userId) {
      throw new UnauthorizedError("You are not allowed to modify this meal");
    }

    const { type, date, items } = body;

    const updatedMeal = await prisma.$transaction(async (tx) => {
      // Remove all existing meal foods associated with this meal
      await tx.mealFood.deleteMany({
        where: { mealId: id },
      });

      // Update the meal and recreate the meal foods list
      return await tx.meal.update({
        where: { id },
        data: {
          type,
          date,
          items: {
            createMany: {
              data: items,
            },
          },
        },
      });
    });

    return updatedMeal;
  }
}

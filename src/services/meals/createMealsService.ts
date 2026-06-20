import prisma from "../../lib/prismaClient.js";
import { createMealsModel } from "../../shared/models/mealsModels.js";

export class CreateMealsService {
  async execute(body: createMealsModel, userId: string) {
    const { name, date, items } = body;
    const meal = await prisma.meal.create({
      data: {
        userId,
        name,
        date,
        items: {
          createMany: {
            data: items,
          },
        },
      },
    });
    return meal;
  }
}

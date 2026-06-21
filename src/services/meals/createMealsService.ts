import prisma from "../../lib/prismaClient.js";
import { createMealsModel } from "../../shared/models/mealsModels.js";

export class CreateMealsService {
  async execute(body: createMealsModel, userId: string) {
    const { type, date, items } = body;
    const meal = await prisma.meal.create({
      data: {
        userId,
        type,
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

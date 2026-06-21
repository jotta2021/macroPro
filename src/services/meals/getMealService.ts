import prisma from "../../lib/prismaClient.js";
import { NotFoundError, UnauthorizedError } from "../../errors/index.js";

export class GetMealService {
  async execute(id: string, userId: string) {
    const meal = await prisma.meal.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            food: true,
          },
        },
      },
    });

    if (!meal) {
      throw new NotFoundError("Meal not found");
    }

    if (meal.userId !== userId) {
      throw new UnauthorizedError("You are not allowed to access this meal");
    }

    return meal;
  }
}

import prisma from "../../lib/prismaClient.js";

export class ListMealsService {
  async execute(userId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const meals = await prisma.meal.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        items: {
          include: {
            food: true,
          },
        },
      },
    });

    return meals;
  }
}

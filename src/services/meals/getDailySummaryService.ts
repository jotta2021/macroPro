import prisma from "../../lib/prismaClient.js";
import { NotFoundError } from "../../errors/index.js";

export class GetDailySummaryService {
  async execute(userId: string, date: Date) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundError("User profile not found. Please create a profile first.");
    }

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

    let caloriesConsumed = 0;
    let carboConsumed = 0;
    let proteinConsumed = 0;
    let fatConsumed = 0;

    for (const meal of meals) {
      for (const item of meal.items) {
        const factor = item.consumedGrams / item.food.baseGrams;
        caloriesConsumed += item.food.calories * factor;
        carboConsumed += item.food.carbo * factor;
        proteinConsumed += item.food.protein * factor;
        fatConsumed += item.food.fat * factor;
      }
    }

    // Rounding to 2 decimal places
    const round = (num: number) => Math.round(num * 100) / 100;

    return {
      caloriesTarget: round(profile.dailyCalories),
      caloriesConsumed: round(caloriesConsumed),
      carboTarget: round(profile.carbo),
      carboConsumed: round(carboConsumed),
      proteinTarget: round(profile.protein),
      proteinConsumed: round(proteinConsumed),
      fatTarget: round(profile.fat),
      fatConsumed: round(fatConsumed),
    };
  }
}

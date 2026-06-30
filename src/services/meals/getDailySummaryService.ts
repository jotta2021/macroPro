import prisma from "../../lib/prismaClient.js";

export class GetDailySummaryService {
  async execute(userId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // 1. Busca o perfil com os alvos/metas da IA
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: { mealTargets: true },
    });

    if (!profile) throw new Error("Perfil não encontrado");

    // 2. Busca as refeições reais consumidas hoje
    const mealsToday = await prisma.meal.findMany({
      where: {
        userId,
        date: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        items: { include: { food: true } },
      },
    });

    // Mapeamento dos blocos fixos para garantir que os 4 sempre apareçam no GET
    const mealTypes = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] as const;

    let totalDayCalories = 0;
    let totalDayProtein = 0;
    let totalDayCarbo = 0;
    let totalDayFat = 0;

    const formattedMeals = mealTypes.map((type) => {
      // Encontra a meta da IA para esse tipo
      const target = profile.mealTargets.find((t) => t.mealType === type);
      // Encontra o consumo real desse tipo hoje
      const realMeal = mealsToday.find((m) => m.type === type);

      let caloriesConsumed = 0;
      let proteinConsumed = 0;
      let carboConsumed = 0;
      let fatConsumed = 0;

      // Calcula os itens se eles existirem
      const items = realMeal
        ? realMeal.items.map((item) => {
            const factor = item.consumedGrams / item.food.baseGrams;

            const itemCal = item.food.calories * factor;
            const itemProt = item.food.protein * factor;
            const itemCarb = item.food.carbo * factor;
            const itemFat = item.food.fat * factor;

            // Soma ao total da refeição
            caloriesConsumed += itemCal;
            proteinConsumed += itemProt;
            carboConsumed += itemCarb;
            fatConsumed += itemFat;

            return {
              id: item.id,
              name: item.food.name,
              grams: item.consumedGrams,
              calories: Math.round(itemCal),
              protein: Math.round(itemProt),
              carbo: Math.round(itemCarb),
              fat: Math.round(itemFat),
            };
          })
        : [];

      // Soma ao total do dia
      totalDayCalories += caloriesConsumed;
      totalDayProtein += proteinConsumed;
      totalDayCarbo += carboConsumed;
      totalDayFat += fatConsumed;

      return {
        type,
        mealId: realMeal?.id,
        caloriesTarget: Math.round(target?.calories || 0),
        caloriesConsumed: Math.round(caloriesConsumed),
        proteinConsumed: Math.round(proteinConsumed),
        carboConsumed: Math.round(carboConsumed),
        fatConsumed: Math.round(fatConsumed),
        items,
      };
    });

    return {
      dailySummary: {
        caloriesTarget: Math.round(profile.dailyCalories),
        caloriesConsumed: Math.round(totalDayCalories),
        proteinTarget: Math.round(profile.protein),
        proteinConsumed: Math.round(totalDayProtein),
        carboTarget: Math.round(profile.carbo),
        carboConsumed: Math.round(totalDayCarbo),
        fatTarget: Math.round(profile.fat),
        fatConsumed: Math.round(totalDayFat),
      },
      meals: formattedMeals,
    };
  }
}

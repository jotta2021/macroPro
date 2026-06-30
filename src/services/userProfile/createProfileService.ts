import { upsertProfileDto } from "../../shared/models/userProfileModel.js";
import prisma from "../../lib/prismaClient.js";
import { BadRequestError } from "../../errors/index.js";
import { AiNutritionService } from "../aiNutrition/aiNutritionService.js";
import { Gender } from "../../../generated/prisma/enums.js";

export class CreateProfileService {
  async execute(userId: string, dto: upsertProfileDto) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const aiService = new AiNutritionService();
    const macrosData = await aiService.execute({
      age: dto.age as number,
      gender: dto.gender as Gender,
      weight: dto.weight,
      height: dto.height,
      activityLevel: dto.activityLevel,
      goal: dto.goal,
    });

    const profile = await prisma.userProfile.create({
      data: {
        userId: user.id,
        age: dto.age,
        gender: dto.gender,
        weight: dto.weight,
        height: dto.height,
        activityLevel: dto.activityLevel,
        goal: dto.goal,
        dailyCalories: macrosData.dailyCalories,
        carbo: macrosData.carbo,
        protein: macrosData.protein,
        fat: macrosData.fat,
        mealTargets: {
          create: macrosData.mealDistribuition.map((mealTarget) => {
            return {
              mealType: mealTarget.mealType,
              calories: mealTarget.calories,
              carbo: mealTarget.carbo,
              protein: mealTarget.protein,
              fat: mealTarget.fat,
            };
          }),
        },
      },
    });
    return profile;
  }
}

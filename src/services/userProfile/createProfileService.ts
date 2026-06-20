import { upsertProfileDto } from "../../shared/models/userProfileModel.js";
import prisma from "../../lib/prismaClient.js";
import { BadRequestError } from "../../errors/index.js";

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

    const profile = await prisma.userProfile.create({
      data: {
        userId: user.id,
        age: dto.age,
        gender: dto.gender,
        weight: dto.weight,
        height: dto.height,
        activityLevel: dto.activityLevel,
        goal: dto.goal,
        dailyCalories: dto.dailyCalories,
        carbo: dto.carbo,
        protein: dto.protein,
        fat: dto.fat,
      },
    });
    return profile;
  }
}

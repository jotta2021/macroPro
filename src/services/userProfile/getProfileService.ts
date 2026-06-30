import { BadRequestError, NotFoundError } from "../../errors/index.js";
import prisma from "../../lib/prismaClient.js";

interface Dto {
  userId: string;
}
export class GetProfileService {
  async execute({ userId }: Dto) {
    const profile = await prisma.userProfile.findUnique({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            emailVerified: true,
          },
        },
        mealTargets: {
          select: {
            id: true,
            mealType: true,
            calories: true,
            carbo: true,
            protein: true,
            fat: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundError("Not found user profile");
    }

    return profile;
  }
}

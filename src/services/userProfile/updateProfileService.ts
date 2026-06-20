import prisma from "../../lib/prismaClient.js";
import { upsertProfileDto } from "../../shared/models/userProfileModel.js";
import { NotFoundError } from "../../errors/index.js";

export class UpdateProfileService {
  async execute(userId: string, dto: upsertProfileDto) {
    const profile = await prisma.userProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    const updateProfile = await prisma.userProfile.update({
      where: {
        userId,
      },
      data: {
        ...dto,
      },
    });

    return updateProfile;
  }
}

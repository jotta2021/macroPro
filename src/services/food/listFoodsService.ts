import prisma from "../../lib/prismaClient.js";

interface ListFoodsDto {
  name?: string;
}

export class ListFoodsService {
  async execute(dto: ListFoodsDto) {
    if (dto.name) {
      return await prisma.food.findMany({
        where: {
          name: {
            contains: dto.name,
            mode: "insensitive",
          },
        },
      });
    }

    return await prisma.food.findMany();
  }
}

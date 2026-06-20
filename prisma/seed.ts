import prisma from "../src/lib/prismaClient.js";
import * as fs from "fs";
import * as path from "path";

async function seedFoods() {
  console.log("Iniciando população tabela de alimentos");

  const jsonPath = path.join(process.cwd(), "prisma", "taco_foods.json");
  const fileContent = fs.readFileSync(jsonPath, "utf-8");
  const foods = JSON.parse(fileContent);

  console.log("Foram encontratos ", foods.length, "alimentos para processar");

  for (const food of foods) {
    const existingFood = await prisma.food.findFirst({
      where: {
        name: food.name,
      },
    });
    if (!existingFood) {
      await prisma.food.create({
        data: {
          ...food,
        },
      });
    }
  }
}

seedFoods()
  .then(() => {
    prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Ocorreu um erro ao executar o seed", e);
    prisma.$disconnect();
  });

import { MealType } from "../../../generated/prisma/enums.js";

export type AiResponseModel = {
  dailyCalories: number;
  protein: number;
  carbo: number;
  fat: number;
  mealDistribuition: [
    {
      mealType: MealType;
      calories: number;
      carbo: number;
      protein: number;
      fat: number;
    },
  ];
};

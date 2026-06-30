import { Type } from "@google/genai";
import {
  ActivityLevel,
  Gender,
  Goal,
} from "../../../generated/prisma/enums.js";
import { ai } from "../../lib/ai.js";
import { BadRequestError } from "../../errors/index.js";
import { AiResponseModel } from "../../shared/models/aiResponset.js";

interface AiCalculatorInput {
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}
export class AiNutritionService {
  async execute(input: AiCalculatorInput) {
    const activityMap: Record<ActivityLevel, string> = {
      [ActivityLevel.SEDENTARY]: "Sedentário (pouco ou nenhum exercicio)",
      [ActivityLevel.MODERATE]:
        "Moderadamente ativo (exercicio moderado 3-5 dias/semana)",
      [ActivityLevel.INTENSE]:
        "Muito ativo (exercicio intenso 6-7 dias/semana)",
    };
    const goalMap: Record<Goal, string> = {
      [Goal.WEIGHTLOSS]: "Emagrecimento/Definição muscular",
      [Goal.MAINTENANCE]: "Manutenção de peso",
      [Goal.HYPERTROPHY]: "Hipertrofia/Ganho de massa muscular",
    };

    const prompt = `
   Atue como um nutricionista esportivo avançado. 
  Calcule as necessidades calóricas diárias, a divisão ideal de macronutrientes totais e também a distribuição dessas calorias e macros por refeição para o seguinte indivíduo:
    - Idade: ${input.age} anos
    - Sexo: ${input.gender === "MALE" ? "Masculino" : "Feminino"}
    - Peso atual: ${input.weight} kg
    - Altura: ${input.height} cm
    - Nível de Atividade Física: ${activityMap[input.activityLevel]}
    - Objetivo Principal: ${goalMap[input.goal]}
Diretrizes de cálculo:
  1. Use fórmulas científicas consolidadas (como Mifflin-St Jeor ou Harris-Benedict) ajustadas pelo nível de atividade e pelo objetivo proposto. 
  2. Distribua os macros de forma que a soma calórica deles (1g proteína = 4kcal, 1g carboidrato = 4kcal, 1g gordura = 9kcal) seja idêntica ao total de calorias recomendadas.
  3. Divida o total diário em 4 blocos de refeições obrigatórios: BREAKFAST, LUNCH, DINNER e SNACK.
  4. Na divisão por refeição, leve em consideração estratégias nutricionais eficientes (ex: maior aporte de carboidratos e proteínas no almoço/jantar, ou lanches balanceados). A soma das calorias e macros das refeições deve bater exatamente com o total diário.
  `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dailyCalories: {
              type: Type.NUMBER,
              description: "Total de  calorias diarias sugeridas",
            },
            carbo: {
              type: Type.NUMBER,
              description: "Quantidade total de carboidratos em gramas",
            },
            protein: {
              type: Type.NUMBER,
              description: "Quantidade total de proteínas em gramas",
            },
            fat: {
              type: Type.NUMBER,
              description: "Quantidade total de gorduras/lipídeos em gramas",
            },
            mealDistribuition: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mealType: {
                    type: Type.STRING,
                    description: "Tipo de refeição",
                  },
                  calories: {
                    type: Type.NUMBER,
                    description: "Calorias da refeição",
                  },
                  carbo: {
                    type: Type.NUMBER,
                    description: "Carboidratos da refeição",
                  },
                  protein: {
                    type: Type.NUMBER,
                    description: "Proteínas da refeição",
                  },
                  fat: {
                    type: Type.NUMBER,
                    description: "Gorduras da refeição",
                  },
                },
                required: ["mealType", "calories", "carbo", "protein", "fat"],
              },
            },
          },
          required: [
            "dailyCalories",
            "carbo",
            "protein",
            "fat",
            "mealDistribuition",
          ],
        },
      },
    });
    if (!response.text) {
      throw new BadRequestError("Ocorreu um erro ao gerar o planejamento");
    }

    const macrosData = JSON.parse(response.text) as AiResponseModel;
    return macrosData;
  }
}

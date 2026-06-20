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
    Calcule as necessidades calóricas diárias e a divisão ideal de macronutrientes (carboidratos, proteínas e gorduras) para o seguinte indivíduo:
    - Idade: ${input.age} anos
    - Sexo: ${input.gender === "MALE" ? "Masculino" : "Feminino"}
    - Peso atual: ${input.weight} kg
    - Altura: ${input.height} cm
    - Nível de Atividade Física: ${activityMap[input.activityLevel]}
    - Objetivo Principal: ${goalMap[input.goal]}

    Use fórmulas científicas consolidadas (como Mifflin-St Jeor ou Harris-Benedict) ajustadas pelo nível de atividade e pelo objetivo proposto. 
    Gere a distribuição de macros de forma que a soma das calorias deles (1g proteina = 4kcal, 1g carbo = 4kcal, 1g gordura = 9kcal) seja coerente com o total de calorias recomendadas.
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
          },
          required: ["dailyCalories", "carbo", "protein", "fat"],
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

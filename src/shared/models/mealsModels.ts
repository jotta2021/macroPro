import z from "zod";
import { CreateMealsSchema, UpdateMealsSchema } from "../schemas/mealsSchem.js";

export type createMealsModel = z.infer<typeof CreateMealsSchema>;
export type updateMealsModel = z.infer<typeof UpdateMealsSchema>;

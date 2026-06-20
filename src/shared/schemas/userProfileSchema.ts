import z from "zod";
import {
  ActivityLevel,
  Goal,
  Gender,
} from "../../../generated/prisma/enums.js";
import { userSchema } from "better-auth";

export const userProfileUpsertSchema = z.object({
  age: z.number().optional(),
  gender: z.enum(Gender).optional(),
  weight: z.number(),
  height: z.number(),
  activityLevel: z.enum(ActivityLevel),
  goal: z.enum(Goal),
  dailyCalories: z.number().optional(),
  carbo: z.number().optional(),
  protein: z.number().optional(),
  fat: z.number().optional(),
});

export const userProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  age: z.number(),
  gender: z.enum(Gender),
  weight: z.number(),
  height: z.number(),
  activityLevel: z.enum(ActivityLevel),
  goal: z.enum(Goal),
  dailyCalories: z.number(),
  carbo: z.number(),
  protein: z.number(),
  fat: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: userSchema,
});

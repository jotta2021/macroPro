import z from "zod";
import { userProfileUpsertSchema } from "../schemas/userProfileSchema.js";
import {
  ActivityLevel,
  Gender,
  Goal,
} from "../../../generated/prisma/enums.js";
import { User } from "../../../generated/prisma/client.js";

export type upsertProfileDto = z.infer<typeof userProfileUpsertSchema>;

export type userProfile = {
  id: string;
  userId: string;
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  dailyCalories: number;
  carbo: number;
  protein: number;
  fat: number;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};

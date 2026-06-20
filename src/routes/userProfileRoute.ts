import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  userProfileUpsertSchema,
  userProfileSchema,
} from "../shared/schemas/userProfileSchema.js";
import z from "zod";
import { errorResponseSchema } from "../errors/index.js";
import { CreateProfileController } from "../controllers/userProfile/createProfileController.js";
import { GetProfileController } from "../controllers/userProfile/getProfileController.js";
import { UpdateProfileController } from "../controllers/userProfile/updateProfileController.js";

export const userProfileRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      tags: ["UserProfile"],
      description: "Create user profile",
      body: userProfileUpsertSchema,
      response: {
        200: z.object({
          id: z.string(),
        }),
        500: errorResponseSchema,
        409: errorResponseSchema,
        401: errorResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const controller = new CreateProfileController();
      await controller.handle(request.body, request.headers, reply);
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      tags: ["UserProfile"],
      description: "Get user profile",
      response: {
        200: userProfileSchema,
        500: errorResponseSchema,
        409: errorResponseSchema,
        401: errorResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const controller = new GetProfileController();
      await controller.handle(request, reply);
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/",
    schema: {
      tags: ["UserProfile"],
      description: "Update user profile",
      body: userProfileUpsertSchema,
      response: {
        200: z.object({
          id: z.string(),
        }),
        500: errorResponseSchema,
        409: errorResponseSchema,
        401: errorResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const controller = new UpdateProfileController();
      await controller.handle(request.body, request.headers, reply);
    },
  });
};

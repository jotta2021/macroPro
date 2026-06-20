import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  CreateMealsSchema,
  UpdateMealsSchema,
  UpdateMealsParamsSchema,
  ListMealsResponseSchema,
} from "../shared/schemas/mealsSchem.js";
import { errorResponseSchema } from "../errors/index.js";
import z from "zod";
import { CreateMealsController } from "../controllers/meals/createMealsController.js";
import { UpdateMealsController } from "../controllers/meals/updateMealsController.js";
import { ListMealsController } from "../controllers/meals/listMealsController.js";

export const MealRoute = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      tags: ["Meals"],
      description: "Create a new Meal",
      body: CreateMealsSchema,
      response: {
        200: z.object({
          id: z.string(),
        }),
        400: errorResponseSchema,
        401: errorResponseSchema,
        500: errorResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const controller = new CreateMealsController();
      await controller.handler(request.body, request.headers, reply);
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/:id",
    schema: {
      tags: ["Meals"],
      description: "Update an existing Meal",
      params: UpdateMealsParamsSchema,
      body: UpdateMealsSchema,
      response: {
        200: z.object({
          id: z.string(),
        }),
        400: errorResponseSchema,
        401: errorResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const controller = new UpdateMealsController();
      await controller.handler(id, request.body, request.headers, reply);
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      tags: ["Meals"],
      description: "List meals for the authenticated user on a specific date",
      querystring: z.object({
        date: z.coerce.date(),
      }),
      response: {
        200: ListMealsResponseSchema,
        400: errorResponseSchema,
        401: errorResponseSchema,
        500: errorResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const controller = new ListMealsController();
      await controller.handle(request, reply);
    },
  });
};

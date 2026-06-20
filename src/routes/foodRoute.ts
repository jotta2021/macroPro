import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import {
  foodCreateSchema,
  foodSchema,
  foodListQuerySchema,
} from "../shared/schemas/foodSchem.js";
import { errorResponseSchema } from "../errors/index.js";
import { ListFoodsController } from "../controllers/food/listFoodsController.js";

export default async function FoodRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      tags: ["Foods"],
      description: "Create Food item",
      body: foodCreateSchema,
      response: {
        200: z.object({
          id: z.string(),
        }),
        500: errorResponseSchema,
        400: errorResponseSchema,
        409: errorResponseSchema,
      },
    },
    handler: () => {},
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      tags: ["Foods"],
      description: "List Food items",
      querystring: foodListQuerySchema,
      response: {
        200: z.array(foodSchema),
        401: errorResponseSchema,
        500: errorResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const controller = new ListFoodsController();
      await controller.handle(request, reply);
    },
  });
}

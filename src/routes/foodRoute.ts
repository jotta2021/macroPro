import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { foodCreateSchema } from "../shared/schemas/foodSchem.js";
import { errorResponseSchema } from "../errors/index.js";

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
}

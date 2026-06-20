import { FastifyReply, FastifyRequest } from "fastify";
import { createMealsModel } from "../../shared/models/mealsModels.js";
import { CreateMealsService } from "../../services/meals/createMealsService.js";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { IncomingHttpHeaders } from "http";
import { UnauthorizedError } from "../../errors/index.js";

export class CreateMealsController {
  async handler(
    body: createMealsModel,
    headers: IncomingHttpHeaders,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: await fromNodeHeaders(headers),
    });
    if (!session?.user) {
      throw new UnauthorizedError("Unauthorized");
    }
    const service = new CreateMealsService();
    const result = await service.execute(body, session.user.id);
    return reply.status(200).send(result);
  }
}

import { FastifyReply, FastifyRequest } from "fastify";
import { GetMealService } from "../../services/meals/getMealService.js";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { UnauthorizedError } from "../../errors/index.js";

export class GetMealController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const session = await auth.api.getSession({
      headers: await fromNodeHeaders(request.headers),
    });

    if (!session?.user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { id } = request.params as { id: string };

    const service = new GetMealService();
    const meal = await service.execute(id, session.user.id);

    return reply.status(200).send(meal);
  }
}

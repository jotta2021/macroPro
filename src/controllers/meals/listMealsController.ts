import { FastifyReply, FastifyRequest } from "fastify";
import { ListMealsService } from "../../services/meals/listMealsService.js";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { UnauthorizedError } from "../../errors/index.js";

export class ListMealsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const session = await auth.api.getSession({
      headers: await fromNodeHeaders(request.headers),
    });

    if (!session?.user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { date } = request.query as { date: Date };

    const service = new ListMealsService();
    const meals = await service.execute(session.user.id, date);

    return reply.status(200).send(meals);
  }
}

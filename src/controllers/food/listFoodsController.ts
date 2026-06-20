import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../errors/index.js";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { ListFoodsService } from "../../services/food/listFoodsService.js";

export class ListFoodsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const session = await auth.api.getSession({
      headers: await fromNodeHeaders(request.headers),
    });

    if (!session?.user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const query = request.query as { name?: string };

    const service = new ListFoodsService();
    const foods = await service.execute({ name: query.name });

    return reply.status(200).send(foods);
  }
}

import { FastifyReply, FastifyRequest } from "fastify";
import { GetDailySummaryService } from "../../services/meals/getDailySummaryService.js";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { UnauthorizedError } from "../../errors/index.js";

export class GetDailySummaryController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const session = await auth.api.getSession({
      headers: await fromNodeHeaders(request.headers),
    });

    if (!session?.user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { date } = request.query as { date: Date };

    const service = new GetDailySummaryService();
    const summary = await service.execute(session.user.id, date);

    return reply.status(200).send(summary);
  }
}

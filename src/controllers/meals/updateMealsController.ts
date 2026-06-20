import { FastifyReply } from "fastify";
import { updateMealsModel } from "../../shared/models/mealsModels.js";
import { UpdateMealsService } from "../../services/meals/updateMealsService.js";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { IncomingHttpHeaders } from "http";
import { UnauthorizedError } from "../../errors/index.js";

export class UpdateMealsController {
  async handler(
    id: string,
    body: updateMealsModel,
    headers: IncomingHttpHeaders,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: await fromNodeHeaders(headers),
    });

    if (!session?.user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const service = new UpdateMealsService();
    const result = await service.execute(id, body, session.user.id);

    return reply.status(200).send({ id: result.id });
  }
}

import { FastifyReply } from "fastify";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { UnauthorizedError } from "../../errors/index.js";
import { CreateProfileService } from "../../services/userProfile/createProfileService.js";
import { IncomingHttpHeaders } from "http";
import { upsertProfileDto } from "../../shared/models/userProfileModel.js";

export class CreateProfileController {
  async handle(
    body: upsertProfileDto,
    headers: IncomingHttpHeaders,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(headers),
    });
    if (!session?.user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const service = new CreateProfileService();
    const res = await service.execute(session.user.id, body);

    return reply.status(200).send(res);
  }
}

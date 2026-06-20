import { FastifyReply, FastifyRequest } from "fastify";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { upsertProfileDto } from "../../shared/models/userProfileModel.js";
import { IncomingHttpHeaders } from "http";
import { UpdateProfileService } from "../../services/userProfile/updateProfileService.js";

export class UpdateProfileController {
  async handle(
    body: upsertProfileDto,
    headers: IncomingHttpHeaders,
    reply: FastifyReply,
  ) {
    const session = await auth.api.getSession({
      headers: await fromNodeHeaders(headers),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const service = new UpdateProfileService();
    const res = await service.execute(session.user.id, body);

    return reply.status(200).send(res);
  }
}

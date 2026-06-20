import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../lib/prismaClient.js";
import { BadRequestError, UnauthorizedError } from "../../errors/index.js";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { GetProfileService } from "../../services/userProfile/getProfileService.js";

export class GetProfileController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const session = await auth.api.getSession({
      headers: await fromNodeHeaders(request.headers),
    });
    if (!session?.user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const service = new GetProfileService();
    const profile = await service.execute({ userId: session.user.id });

    return reply.status(200).send(profile);
  }
}

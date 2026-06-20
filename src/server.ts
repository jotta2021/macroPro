import "dotenv/config";
import Fastify from "fastify";
import swagger from "@fastify/swagger";
import fastifyCors from "@fastify/cors";
import fastifyApiReference from "@scalar/fastify-api-reference";
import {
  ZodTypeProvider,
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import FoodRoute from "./routes/foodRoute.js";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { userProfileRoute } from "./routes/userProfileRoute.js";
import { MealRoute } from "./routes/mealRoute.js";
const app = Fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(swagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Test swagger",
      description: "Testing the Fastify swagger API",
      version: "0.1.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  transform: jsonSchemaTransform,
});

await app.register(fastifyCors, {
  origin: ["http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  maxAge: 86400,
});

await app.register(fastifyApiReference, {
  routePrefix: "/api-docs",
  configuration: {
    sources: [
      {
        title: "Documentação API MacroPro",
        slug: "api",
        url: "/swagger.json",
      },
      {
        title: "better auth",
        slug: "auth",
        url: "/api/auth/open-api/generate-schema",
      },
    ],
  },
});

//routees
app.register(FoodRoute, { prefix: "/foods" });
app.register(userProfileRoute, { prefix: "/profile" });
app.register(MealRoute, { prefix: "/meals" });

await app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/swagger.json",
  schema: {
    hide: true,
  },
  handler: () => {
    return app.swagger();
  },
});

app.get("/", async function (request, reply) {
  return { hello: "world" };
});

app.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  schema: {
    hide: true,
  },
  async handler(request, reply) {
    try {
      // Construct request URL
      const url = new URL(request.url, `http://${request.headers.host}`);

      // Convert Fastify headers to standard Headers object
      const headers = fromNodeHeaders(request.headers);
      // Create Fetch API-compatible request
      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        ...(request.body ? { body: JSON.stringify(request.body) } : {}),
      });
      // Process authentication request
      const response = await auth.handler(req);
      // Forward response to client
      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      return reply.send(response.body ? await response.text() : null);
    } catch (error) {
      app.log.error("Authentication Error:");
      return reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
  },
});
await app.ready();
app.swagger();
try {
  await app.listen({ port: Number(process.env.PORT) || 3000 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

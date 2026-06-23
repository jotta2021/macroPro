import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import { expo } from "@better-auth/expo";
import prisma from "./prismaClient.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: "https://berenice-costliest-ruthie.ngrok-free.dev",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [openAPI(), expo()],
  trustedOrigins: [
    "http://localhost:3000",
    "http://10.0.2.2:3000",
    "http://192.168.3.230:3000",
    "meuapp://",
    "exp://",
    "exp://***",
    "https://stale-lights-rush.loca.lt/",
    "https://berenice-costliest-ruthie.ngrok-free.dev",
  ],
});

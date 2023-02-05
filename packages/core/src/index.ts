import * as prisma from "@prisma/client";
export type {
  User,
  Client,
  AccessToken,
  PrismaClient,
  //
  Prisma as DBClientArgs,
} from "@prisma/client";
export const dbClient = new prisma.PrismaClient();

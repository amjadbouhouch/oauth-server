import * as prisma from "@prisma/client";
export type {
  User,
  Client,
  AccessToken,
  Prisma as DBClient,
  Role,
} from "@prisma/client";
export const dbClient = new prisma.PrismaClient();

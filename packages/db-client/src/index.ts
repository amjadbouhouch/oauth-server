import * as prisma from '@prisma/client';
export type { User, Client, AccessToken, Prisma as DBClient } from '@prisma/client';
export const dbClient = new prisma.PrismaClient();

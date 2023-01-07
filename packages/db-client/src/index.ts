import * as prisma from '@prisma/client';
export type { User } from '@prisma/client';
export const dbClient = new prisma.PrismaClient();

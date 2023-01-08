import { injectable } from 'inversify';
import { dbClient } from '@oauth/db-client';
import { generateId } from '../utils/helper';

const adminConsoleId = 'security-admin-console';
@injectable()
export class DbClient {
  constructor() {
    this.seed();
  }
  // #https://www.prisma.io/docs/guides/database/seed-database
  private async seed() {
    try {
      await dbClient.user.upsert({
        where: { email: 'admin@oauth.com' },
        update: {},
        create: {
          email: 'admin@oauth.com',
          firstName: 'admin',
          lastName: 'admin',
        },
      });
      await dbClient.client.upsert({
        where: {
          clientId: adminConsoleId,
        },
        update: {},
        create: {
          clientId: adminConsoleId,
          clientSecret: generateId(),
          redirectUris: ['http://localhost:3000/callback'],
          name: 'My test App',
        },
      });
    } catch (error) {}
  }
  async disconnect() {
    return dbClient.$disconnect();
  }
  get user() {
    return dbClient.user;
  }
  get client() {
    return dbClient.client;
  }
  get accessToken() {
    return dbClient.accessToken;
  }
}

import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { dbClient } from '@oauth/core';
import { generateId } from '../utils/helper';
import { BCryptService } from './';
import { Constants } from 'utils';

@injectable()
export class DbClient {
  // LazyServiceIdentifer: https://github.com/inversify/InversifyJS/issues/1206
  constructor(@inject(new LazyServiceIdentifer(() => BCryptService)) private _bcryptService: BCryptService) {
    this.seed();
  }
  // #https://www.prisma.io/docs/guides/database/seed-database
  private async seed() {
    try {
      // await dbClient.accessToken.deleteMany();
      // await dbClient.client.deleteMany();
      // await dbClient.user.deleteMany();
      // create first user
      const hashedPassword = await this._bcryptService.hash('admin');
      const user = await dbClient.user.upsert({
        where: { email: 'admin@oauth.com' },
        update: {
          role: 'ADMIN',
        },
        create: {
          email: 'admin@oauth.com',
          firstName: 'Bouhouch',
          lastName: 'Amjed',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });

      // create first client 'admin-console'
      await dbClient.client.upsert({
        where: {
          clientId: Constants.ADMIN_CONSOLE_CLIENT_ID,
        },
        update: {
          redirectUris: ['http://localhost:3001/oauth'],
        },
        create: {
          clientId: Constants.ADMIN_CONSOLE_CLIENT_ID,
          clientSecret: generateId(),
          name: 'Admin console',
          redirectUris: ['http://localhost:3001/oauth'],
          isPublic: false,
          enabled: true,
          createdBy: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
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

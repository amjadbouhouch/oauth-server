import { injectable } from 'inversify';
import { dbClient } from '@oauth/db-client';

@injectable()
export class DbClient {
  async disconnect() {
    return dbClient.$disconnect();
  }
  get user() {
    return dbClient.user;
  }
}

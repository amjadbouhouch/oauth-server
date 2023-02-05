import { IRepository } from '../interfaces/IRepository';
import { injectable } from 'inversify';
import { AccessToken, DBClientArgs } from '@oauth/core';
import { DbClient } from 'middleware';

@injectable()
export class AccessTokenRepository implements IRepository<AccessToken> {
  constructor(private _dbClient: DbClient) {}

  create(payload: DBClientArgs.AccessTokenCreateInput): Promise<AccessToken> {
    return this._dbClient.accessToken.create({
      data: payload,
    });
  }
  list(): Promise<AccessToken[]> {
    throw new Error('Method not implemented.');
  }
  retrieve(id: string): Promise<AccessToken | null> {
    return this._dbClient.accessToken.findUnique({
      where: {
        id,
      },
    });
  }
  update(payload: AccessToken): Promise<any> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { IRepository } from '../interfaces';
import { Client, DBClientArgs } from '@oauth/core';
import { DbClient } from 'middleware';

@injectable()
export class ClientRepository implements IRepository<Client> {
  constructor(@inject(new LazyServiceIdentifer(() => DbClient)) private readonly _dbService: DbClient) {}
  retrieveByClientId(clientId: string) {
    return this._dbService.client.findUnique({
      where: {
        clientId,
      },
    });
  }
  create(data: DBClientArgs.ClientCreateArgs['data']): Promise<Client> {
    return this._dbService.client.create({
      data,
    });
  }
  list(): Promise<Client[]> {
    return this._dbService.client.findMany();
  }
  retrieve(id: string): Promise<Client | null> {
    return this._dbService.client.findUnique({
      where: {
        id,
      },
    });
  }

  update(payload: Client): Promise<any> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

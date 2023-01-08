import { injectable } from 'inversify';
import { IRepository } from './../interfaces';
import { Client } from '@oauth/db-client';
import { DbClient, NotFoundError } from 'middleware';

@injectable()
export class ClientRepository implements IRepository<Client> {
  constructor(private readonly _dbService: DbClient) {}
  list(): Promise<Client[]> {
    throw new Error('Method not implemented.');
  }
  async retrieve(clientId: string): Promise<Client> {
    const client = await this._dbService.client.findUnique({
      where: {
        clientId,
      },
    });
    if (!client) {
      throw new NotFoundError();
    }
    return client;
  }

  update(payload: Client): Promise<any> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

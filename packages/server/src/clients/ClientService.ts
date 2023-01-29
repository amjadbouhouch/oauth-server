import { Client } from '@oauth/db-client';
import { injectable, inject, LazyServiceIdentifer } from 'inversify';
import { NotFoundError } from 'middleware';
import { IService } from '../interfaces/IService';
import { ClientRepository } from 'clients';

@injectable()
export class ClientService implements IService<Client> {
  constructor(@inject(new LazyServiceIdentifer(() => ClientRepository)) private _clientRepo: ClientRepository) {}
  list(): Promise<Client[]> {
    return this._clientRepo.list();
  }
  retrieve(id: string): Promise<Client> {
    throw new Error('Method not implemented.');
  }

  async retrieveByClientId(clientId: string): Promise<Client> {
    const client = await this._clientRepo.retrieveByClientId(clientId);
    if (!client) throw new NotFoundError();
    return client;
  }
  update(payload: any): Promise<void | Client> {
    throw new Error('Method not implemented.');
  }
  create(payload: any): Promise<void | Client> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

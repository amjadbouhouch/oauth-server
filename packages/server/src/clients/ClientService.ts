import { Client } from '@oauth/core';
import { ClientRepository } from 'clients';
import crypto from 'crypto';
import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { NotFoundError } from 'middleware';
@injectable()
export class ClientService {
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
    return this._clientRepo.create({
      ...payload,
      clientSecret: crypto.randomUUID(),
    });
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

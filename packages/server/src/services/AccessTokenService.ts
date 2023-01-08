import { AccessToken } from '@oauth/db-client';
import { injectable } from 'inversify';
import { AccessTokenRepository } from 'Repository';
import { IService } from '../interfaces/IService';

@injectable()
export class AccessTokenService implements IService<AccessToken> {
  constructor(private readonly _accessTokenRepository: AccessTokenRepository) {}
  list(): Promise<AccessToken[]> {
    throw new Error('Method not implemented.');
  }
  retrieve(id: string): Promise<AccessToken> {
    throw new Error('Method not implemented.');
  }
  update(payload: any): Promise<void | AccessToken> {
    throw new Error('Method not implemented.');
  }
  create(payload: any): Promise<void | AccessToken> {
    return this._accessTokenRepository.create(payload);
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

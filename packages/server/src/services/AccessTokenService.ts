import { UnauthorizedError } from 'middleware';
import { AccessToken } from '@oauth/db-client';
import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { AccessTokenRepository } from 'Repository';
import { IService } from '../interfaces/IService';

@injectable()
export class AccessTokenService implements IService<AccessToken> {
  constructor(@inject(new LazyServiceIdentifer(() => AccessTokenRepository)) private _accessTokenRepository: AccessTokenRepository) {}
  list(): Promise<AccessToken[]> {
    throw new Error('Method not implemented.');
  }
  async retrieve(id: string): Promise<AccessToken> {
    const accessToken = await this._accessTokenRepository.retrieve(id);
    if (!accessToken) throw new UnauthorizedError();
    return accessToken;
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

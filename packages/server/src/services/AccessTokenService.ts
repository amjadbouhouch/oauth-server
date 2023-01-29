import { UnauthorizedError, JwtService } from 'middleware';
import { AccessToken, User, Client } from '@oauth/db-client';
import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { AccessTokenRepository } from 'Repository';
import { IService } from '../interfaces/IService';

@injectable()
export class AccessTokenService implements IService<AccessToken> {
  constructor(
    @inject(new LazyServiceIdentifer(() => AccessTokenRepository)) private _accessTokenRepository: AccessTokenRepository,
    @inject(new LazyServiceIdentifer(() => JwtService)) private _jwtService: JwtService,
  ) {}
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

  async create(
    user: User,
    client: Client,
  ): Promise<{
    access_token: string;
    expires_in: Date | null;
    token_type: string;
  }> {
    const { accessToken, id, tokenExpiresAt } = this._jwtService.getToken(user, client);

    const createdToken = await this._accessTokenRepository.create({
      id,
      token: accessToken,
      tokenExpiresAt: new Date(tokenExpiresAt),
      client: {
        connect: {
          clientId: client.clientId,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      },
    });
    return {
      access_token: createdToken.token,
      expires_in: createdToken.tokenExpiresAt,
      token_type: 'Bearer',
    };
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

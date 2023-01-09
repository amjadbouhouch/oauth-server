import { RequestAccessTokenResponse } from 'interfaces';
import { injectable, inject, LazyServiceIdentifer } from 'inversify';
import { JwtService, BadRequestError } from 'middleware';
import { AccessTokenRepository } from 'Repository';
import { OAuthResourceOwnerPasswordCredentialsClass } from '../middleware/validators/OAuthRequestTokenClass';
import { generateUuid } from '../utils/helper';
import { OAuthAuthorizeClass } from './../middleware/validators/OAuthAuthorizeClass';
import { ClientService } from './clientService';
import { UserService } from './userService';

@injectable()
export class OauthService {
  constructor(
    @inject(new LazyServiceIdentifer(() => UserService)) private _userService: UserService,
    @inject(new LazyServiceIdentifer(() => ClientService)) private _clientService: ClientService,
    @inject(new LazyServiceIdentifer(() => JwtService)) private _jwtService: JwtService,
    @inject(new LazyServiceIdentifer(() => AccessTokenRepository)) private _accessTokenRepository: AccessTokenRepository,
  ) {}

  async authorize(payload: OAuthAuthorizeClass) {
    if (payload.grant_type === 'authorization_code') {
      return this.handleAuthentication(payload);
    }
    return this.handleAuthorization(payload);
  }

  //** Authorization */
  async handleAuthorization(payload: OAuthAuthorizeClass) {
    throw new Error('Method not implemented.');
  }
  /** Authentication openId connect */
  async handleAuthentication(payload: OAuthAuthorizeClass) {
    throw new Error('Method not implemented.');
  }
  /**
   *
   * @returns
   */
  async requestAccessToken(payload: any): Promise<RequestAccessTokenResponse> {
    return {
      access_token: '123',
      expires_in: 3600,
      token_type: 'Bearer',
    };
  }
  /**
   * @ grant_type=resource_owner_password_credentials
   */
  async requestAccessTokenByResourceOwnerPasswordCredentials(
    payload: OAuthResourceOwnerPasswordCredentialsClass,
  ): Promise<RequestAccessTokenResponse> {
    const user = await this._userService.findByEmailAndPassword(payload.email, payload.password);
    const client = await this._clientService.retrieveByClientId(payload.client_id);
    // generate accessToken
    const now = new Date();
    const oneYearAfter = now.setDate(now.getDate() + 365);
    const id = generateUuid();
    const tokenPayload = {
      exp: oneYearAfter, // expiration timestamp
      iat: now.getTime(), // time was issued
      jti: id,
      //issuer // static
      iss: 'http://localhost:3000',
      // audience
      aud: 'account',
      allowed_origins: ['http://localhost:3000'],
      scopes: [],
      email: user.email,
      email_verified: true,
      clientId: client.clientId,
      azp: client.clientId,
      type: 'Bearer',
    };

    const access_token = this._jwtService.generateToken(tokenPayload);
    const createdToken = await this._accessTokenRepository.create({
      id,
      token: access_token,
      tokenExpiresAt: new Date(tokenPayload.exp),
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
      scopes: tokenPayload.scopes,
    });

    return {
      access_token: createdToken.token,
      expires_in: tokenPayload.exp,
      token_type: tokenPayload.type,
    };
  }
}

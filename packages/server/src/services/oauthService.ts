import { generateId } from './../utils/helper';
import { RequestAccessTokenResponse } from 'interfaces';
import { injectable } from 'inversify';
import { OAuthAuthorizeClass } from './../middleware/validators/OAuthAuthorizeClass';
import { OAuthResourceOwnerPasswordCredentialsClass } from '../middleware/validators/OAuthRequestTokenClass';
import { AccessTokenRepository, ClientRepository, UserRepository } from 'Repository';
import { JwtService } from 'middleware';
import { generateUuid } from '../utils/helper';

@injectable()
export class OauthService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _ClientRepository: ClientRepository,
    private readonly _jwtService: JwtService,
    private readonly _accessTokenRepository: AccessTokenRepository,
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
  async handleAuthentication(payload: OAuthAuthorizeClass) {}
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
   *
   */
  async requestAccessTokenByResourceOwnerPasswordCredentials(
    payload: OAuthResourceOwnerPasswordCredentialsClass,
  ): Promise<RequestAccessTokenResponse> {
    // fetch the user
    const user = await this._userRepository.findByEmailAndPassword(payload.email, payload.password);
    // fetch the client
    const client = await this._ClientRepository.retrieve(payload.client_id);
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
      typ: 'Bearer',
      azp: client.clientId,
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
      token_type: tokenPayload.typ,
    };
  }
}

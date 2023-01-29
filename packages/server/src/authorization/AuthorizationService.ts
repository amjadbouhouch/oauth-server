import { ClientService } from 'clients';
import { RequestAccessTokenResponse } from 'interfaces';
import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { BadRequestError, JwtService } from 'middleware';
import { AccessTokenService, UserService } from 'services';
import { OAuthAuthorizeClass } from '../middleware/validators/OAuthAuthorizeClass';
import { generateUuid } from '../utils/helper';
type AuthorizationPayloadType = {
  client_id: string;
  response_type: string;
  redirect_uri: string;
  userId: string;
  scope?: string;
  state?: string;
};
@injectable()
export class AuthorizationService {
  private _codes = new Map<string, { clientId: string; userId: string; expiredAt: Date; redirectUri: string }>();
  constructor(
    @inject(new LazyServiceIdentifer(() => UserService)) private _userService: UserService,
    @inject(new LazyServiceIdentifer(() => ClientService)) private _clientService: ClientService,
    @inject(new LazyServiceIdentifer(() => JwtService)) private _jwtService: JwtService,
    @inject(new LazyServiceIdentifer(() => AccessTokenService)) private _accessTokenService: AccessTokenService,
  ) {}
  /**
   *
   * @param payload
   * @returns
   */
  generateAuthorizationCode(payload): string {
    const code = generateUuid() + generateUuid();

    this._codes.set(code, payload);
    return code;
  }
  verifyAuthorizationCode({ code, ...payload }): boolean {
    const storedCode = this._codes.get(code);
    if (!storedCode) {
      return false;
    }
    const isExpired = storedCode.expiredAt <= new Date();
    if (isExpired) {
      this._codes.delete(code);
      return false;
    }

    if (storedCode.redirectUri !== payload.redirectUri || storedCode.clientId !== payload.clientId) {
      return false;
    }
    this._codes.delete(code);
    return true;
  }
  async getConcentScreenProps({ client_id, redirect_uri, response_type, userId, scope, state }: AuthorizationPayloadType) {
    const client = await this._clientService.retrieveByClientId(client_id);
    // if (!client.redirectUris) {
    //   throw new BadRequestError('redirect url not registred');
    // }
    // if (!(client.redirectUris as string[]).includes(redirect_uri)) {
    //   throw new BadRequestError('redirect url not registred');
    // }

    const user = await this._userService.retrieve(userId);

    return scope?.split(' ').map((s) => ({
      title: s,
      description: `Allow ${client.name} to access ${s}`,
    }));
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
  async requestAccessToken({ code, client_id }: { code: string; client_id: string }): Promise<RequestAccessTokenResponse> {
    const payload = this._codes.get(code);
    if (!payload) {
      throw new BadRequestError();
    }

    const isExpired = payload.expiredAt >= new Date();

    if (!payload?.clientId || client_id !== payload.clientId || isExpired) throw new BadRequestError();

    const user = await this._userService.retrieve(payload.userId);

    const client = await this._clientService.retrieveByClientId(payload.clientId);

    if (!(client.redirectUris as string[]).includes(payload.redirectUri)) throw new BadRequestError();

    const response = await this._accessTokenService.create(user, client);
    return response;
  }
  /**
   * @ grant_type=resource_owner_password_credentials
   */
  // async requestAccessTokenByResourceOwnerPasswordCredentials(
  //   payload: OAuthResourceOwnerPasswordCredentialsClass,
  // ): Promise<RequestAccessTokenResponse> {
  // const user = await this._userService.findByEmailAndPassword(payload.email, payload.password);
  // const client = await this._clientService.retrieveByClientId(payload.client_id);
  // // generate accessToken
  // const now = new Date();
  // const oneYearAfter = now.setDate(now.getDate() + 365);
  // const id = generateUuid();
  // const tokenPayload = {
  //   exp: oneYearAfter, // expiration timestamp
  //   iat: now.getTime(), // time was issued
  //   jti: id,
  //   //issuer // static
  //   iss: 'http://localhost:3000',
  //   // audience
  //   aud: 'account',
  //   allowed_origins: ['http://localhost:3000'],
  //   scopes: [],
  //   email: user.email,
  //   email_verified: true,
  //   clientId: client.clientId,
  //   azp: client.clientId,
  //   type: 'Bearer',
  // };

  // const access_token = this._jwtService.generateToken(tokenPayload);
  // const createdToken = await this._accessTokenRepository.create({
  //   id,
  //   token: access_token,
  //   tokenExpiresAt: new Date(tokenPayload.exp),
  //   client: {
  //     connect: {
  //       clientId: client.clientId,
  //     },
  //   },
  //   user: {
  //     connect: {
  //       id: user.id,
  //     },
  //   },
  //   scopes: tokenPayload.scopes,
  // });

  // return {
  //   access_token: createdToken.token,
  //   expires_in: tokenPayload.exp,
  //   token_type: tokenPayload.type,
  // };
  // }
}

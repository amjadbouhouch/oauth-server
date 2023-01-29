import { ClientService } from 'clients';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError, JwtService } from 'middleware';
import { AccessTokenService, UserService } from 'services';
import { UnauthorizedError } from '../errors/UnauthorizedError';
export default class AccessTokenValidator {
  constructor() {
    this.execute = this.execute.bind(this);
  }
  async execute(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization as string;
    if (!authorizationHeader) throw new UnauthorizedError();
    const [type, token] = authorizationHeader.split(' ');
    const jwtService: JwtService = global._container.get<JwtService>(JwtService);
    // throw new UnauthorizedError();
    let payload;
    try {
      payload = jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedError();
    }
    if (!payload) throw new UnauthorizedError();

    const {
      // accessToken id
      jti,
      client_id,
      allowed_origins = [],
      scopes = [],
      azp: clientToAccess,
      ...rest
    } = payload;

    const accessTokenService: AccessTokenService = global._container.get<AccessTokenService>(AccessTokenService);
    const userService: UserService = global._container.get<UserService>(UserService);
    const clientService: ClientService = global._container.get<ClientService>(ClientService);

    const accessToken = await accessTokenService.retrieve(jti as string);

    if (type !== accessToken.type) {
      throw new BadRequestError();
    }

    const user = await userService.retrieve(accessToken.userId);

    const client = await clientService.retrieveByClientId(client_id);
    req.accessToken = accessToken;
    req.user = user;
    req.client = client;
    next();
  }
  public static verify() {
    return new AccessTokenValidator().execute;
  }
}

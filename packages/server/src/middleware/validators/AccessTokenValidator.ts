import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';
import { BadRequestError, JwtService } from 'middleware';
import { AccessTokenService, ClientService, UserService } from 'services';
import { UnauthorizedError } from './../errors/UnauthorizedError';

@injectable()
export class AccessTokenValidator {
  // add resource
  constructor() {}

  static async verify(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization as string;
    if (!authorizationHeader) throw new UnauthorizedError();
    const [type, token] = authorizationHeader.split(' ');
    const jwtService: JwtService = global._container.get<JwtService>(JwtService);
    // throw new UnauthorizedError();
    const payload = jwtService.verify(token);
    if (!payload) throw new UnauthorizedError();
    const {
      // accessToken id
      jti,
      clientId,
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
      throw new BadRequestError('missing grant type');
    }
    const user = await userService.retrieve(accessToken.userId);
    const client = await clientService.retrieveByClientId(clientId);
    req.accessToken = accessToken;
    req.user = user;
    req.client = client;
    next();
  }
}

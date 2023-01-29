import { Request, Response } from 'express';
import { controller, httpGet, request, response } from 'inversify-express-utils';
import AccessTokenValidator from 'middleware/RequestValidator/accessTokenValidator';

// openid connect
@controller('/userinfo')
export class UserInfoController {
  constructor() {}

  @httpGet('/', AccessTokenValidator.verify())
  async requestAccessToken(@request() req: Request, @response() res: Response) {
    res.send(req.user);
  }
}

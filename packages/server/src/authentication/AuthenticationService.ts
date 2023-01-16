import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { queryParam, request, response } from 'inversify-express-utils';
import { UserService } from 'services';

@injectable()
export class AuthenticationController {
  constructor(private readonly _userService: UserService) {}

  async loginPage(
    @request() req: Request,
    @response() res: Response,
    @queryParam('redirect_uri') redirect_uri,
    @queryParam('client_id') client_id,
    @queryParam('response_type') response_type,
    @queryParam('scope') scope,
  ) {
    res.render('pages/login');
  }
}

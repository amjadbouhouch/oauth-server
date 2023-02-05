import { BadRequestError } from 'middleware';
import { Request, Response } from 'express';
import { controller, httpGet, httpPost, queryParam, request, requestBody, response } from 'inversify-express-utils';
import { UserService } from 'services';
import { QueryBuilder } from 'utils';
import { ClientService } from 'clients';
import { Logger } from 'config';

@controller('')
export class AuthenticationController {
  logger = Logger.getLogger(AuthenticationController.name);
  constructor(private readonly _clientService: ClientService, private readonly _userService: UserService) {}

  /**
   */
  @httpGet('/auth/login')
  async loginPage(
    @request() req: Request,
    @response() res: Response,
    @queryParam('redirect_uri') redirect_uri,
    @queryParam('client_id') client_id,
    @queryParam('response_type') response_type,
    @queryParam('scope') scope,
  ) {
    if (!client_id || !redirect_uri || !response_type || !scope) {
      throw new BadRequestError();
    }
    const client = await this._clientService.retrieveByClientId(client_id);
    const clientName = client.name;
    res.render('pages/login', { clientName });
  }

  @httpPost('/auth/login')
  async loginFromConsent(
    @request() req: Request,
    @response() res: Response,
    @queryParam('redirect_uri') redirect_uri,
    @queryParam('response_type') response_type,
    @queryParam('scope') scope,
    @queryParam('client_id') client_id,
    @queryParam('state') state,
  ) {
    // TODO query validation

    const { email, password } = req.body;
    const user = await this._userService.findByEmailAndPassword(email, password);

    if (user) {
      req.session.isAuthenticated = true;
      req.session.userId = user.id;
      const url = new QueryBuilder()
        .setUrl('/authorize')
        .setQueryParam('client_id', client_id)
        .setQueryParam('redirect_uri', redirect_uri)
        .setQueryParam('response_type', response_type)
        .setQueryParam('scope', scope)
        .setQueryParam('state', state)
        .build();
      res.redirect(url);
    } else {
      res.redirect('pages/login');
    }
  }
}

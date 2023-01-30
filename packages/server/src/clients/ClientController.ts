import { ValidatorMiddleware } from './../middleware/validators/validator-middleware';
import { ClientService } from 'clients';
import { Response } from 'express';
import { inject, LazyServiceIdentifer } from 'inversify';
import { controller, httpGet, httpPost, requestBody, response } from 'inversify-express-utils';

import { AccessTokenValidator2 } from 'middleware/RequestValidator/accessTokenValidator2';
import RoleValidator from 'middleware/RequestValidator/RoleValidator';
import { NewClientRequestBodyValidator } from 'middleware';

@controller('/clients')
export class ClientController {
  constructor(@inject(new LazyServiceIdentifer(() => ClientService)) private readonly _clientService: ClientService) {}

  @httpGet(
    '/',
    AccessTokenValidator2.verify(),
    RoleValidator.verify('ADMIN'),
    // ScopeValidator.verify(['*', 'clients.all', 'clients.read']),
  )
  async list(@response() res: Response) {
    const clients = await this._clientService.list();
    res.send(clients);
  }
  @httpPost('/', AccessTokenValidator2.verify(), RoleValidator.verify('ADMIN'), ValidatorMiddleware.validate(NewClientRequestBodyValidator))
  async create(@response() res: Response, @requestBody() body) {
    const newClient = await this._clientService.create(body);
    res.send(newClient);
  }
}

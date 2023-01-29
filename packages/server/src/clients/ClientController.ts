import { ClientService } from 'clients';
import { Response } from 'express';
import { inject, LazyServiceIdentifer } from 'inversify';
import { controller, httpGet, response } from 'inversify-express-utils';

import { AccessTokenValidator2 } from 'middleware/RequestValidator/accessTokenValidator2';
import RoleValidator from 'middleware/RequestValidator/RoleValidator';

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
}

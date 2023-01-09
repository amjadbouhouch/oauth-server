import { Response } from 'express';
import { controller, httpGet, response } from 'inversify-express-utils';
import { AccessTokenValidator, ScopeValidator } from 'middleware';

@controller('/clients')
export class ClientController {
  constructor() {}

  @httpGet('/', AccessTokenValidator.verify, ScopeValidator.verify(['clients.all', 'clients.read']))
  async list(@response() res: Response) {
    res.send('hello');
  }
}

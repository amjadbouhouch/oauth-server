import { Request, Response } from 'express';
import { controller, httpPost, request, response } from 'inversify-express-utils';
import { OauthService } from 'services';
import { OAuthRequestTokenClass, ValidatorMiddleware } from '../middleware/validators';

@controller('/oauth')
export class OAuthController {
  constructor(private readonly _oauthService: OauthService) {}
  /**
   *
   *
   */
  @httpPost('/token', ValidatorMiddleware.validate(OAuthRequestTokenClass))
  async requestAccessToken(@request() req: Request, @response() res: Response) {
    const response = await this._oauthService.requestAccessToken(req.body);
    res.status(200).send(response);
  }
}

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { controller, httpPost, request, requestBody, response } from 'inversify-express-utils';
import { BadRequestError } from 'middleware';
import { OauthService } from 'services';
import { grantType } from 'utils';
import { OAuthResourceOwnerPasswordCredentialsClass } from '../middleware/validators/OAuthRequestTokenClass';

@controller('/oauth')
export class OAuthController {
  constructor(private readonly _oauthService: OauthService) {}
  /**
   *
   *
   */
  @httpPost('/token')
  async requestAccessToken(@request() req: Request, @response() res: Response, @requestBody() body) {
    if (!body.grant_type) {
      throw new BadRequestError('missing grant_type');
    }
    const grantType = body.grant_type as grantType;

    let transformedBody: OAuthResourceOwnerPasswordCredentialsClass;
    switch (grantType) {
      case 'resource_owner_password_credentials':
        transformedBody = plainToInstance(OAuthResourceOwnerPasswordCredentialsClass, body, {
          excludeExtraneousValues: true,
        });
        break;
      case 'authorization_code':
      case 'code':
      case 'refresh_token':
        throw new Error('authorization_code not implemented');

      default:
        throw new BadRequestError('grant_type not supported');
    }
    const errors = await validate(transformedBody);
    if (errors.length > 0) {
      const errorMessage = '';
      if (errors[0].constraints && Object.keys(errors[0].constraints).length > 0) {
        // errorMessage = Object.keys(errors[0].constraints)[0]
      }
      throw new BadRequestError(errorMessage);
    }
    const response = await this._oauthService.requestAccessTokenByResourceOwnerPasswordCredentials(req.body);
    res.status(200).send(response);
  }
}

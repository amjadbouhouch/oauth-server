import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { controller, httpGet, httpPost, queryParam, request, requestBody, response } from 'inversify-express-utils';
import { BadRequestError } from 'middleware';
import { UserService } from 'services';
import { grantType, QueryBuilder } from 'utils';
import { OAuthResourceOwnerPasswordCredentialsClass } from '../middleware/validators/OAuthRequestTokenClass';
import { AuthorizationService } from './AuthorizationService';

@controller('')
export class AuthorizationController {
  constructor(private readonly _authorizationService: AuthorizationService, private readonly _userService: UserService) {}
  /**
   *
   *
   */
  @httpGet('/authorize')
  async getConsentScreen(
    @request() req: Request,
    // required
    @queryParam('client_id') client_id,
    // required
    @queryParam('response_type') response_type,
    // required
    @queryParam('redirect_uri') redirect_uri,
    // optional
    @queryParam('scope') scope,
    // optional
    @queryParam('state') state,
    @response() res: Response,
  ) {
    if (!req.session.isAuthenticated)
      return res.redirect(
        `/auth/login?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`,
      );

    const authorizationsList = await this._authorizationService.getConcentScreenProps({
      client_id,
      redirect_uri,
      response_type,
      userId: req.session.userId,
      scope,
      state,
    });

    // res.send(200);
    res.render('pages/consent', {
      authorizationsList,
    });
  }
  @httpPost('/authorize')
  async submitConsentScreen(
    @request() req: Request,
    @queryParam('client_id') client_id,
    @queryParam('response_type') response_type,
    @queryParam('redirect_uri') redirect_uri,
    // optional
    @queryParam('scope') scope,
    // optional
    @queryParam('state') state,
    @response() res: Response,
  ) {
    const { consent } = req.body;
    if (consent === 'allow') {
      // generate code
      const fullUrl = new QueryBuilder()
        .setUrl(redirect_uri)
        .setQueryParam(
          'code',
          this._authorizationService.generateAuthorizationCode({
            clientId: client_id,
            redirectUri: redirect_uri,
            userId: req.session.userId,
          }),
        )
        .setQueryParam('state', state)
        .setQueryParam('client_id', client_id)
        .build();
      res.redirect(fullUrl);
    } else {
    }
  }

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

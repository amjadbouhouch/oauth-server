import { injectable } from 'inversify';
import { OAuthRequestTokenClass } from 'middleware';
interface RequestAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
@injectable()
export class OauthService {
  constructor() {}

  /**
   *
   */
  async requestAccessToken(payload: OAuthRequestTokenClass): Promise<RequestAccessTokenResponse> {
    return {
      access_token: '123',
      expires_in: 3600,
      token_type: 'Bearer',
    };
  }
}

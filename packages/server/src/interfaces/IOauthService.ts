export interface RequestAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: Date | null;
}

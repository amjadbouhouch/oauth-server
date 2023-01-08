/**
 *
 */
export const grantTypes = {
  // openid-connect (authentication)
  authorization_code: 'authorization_code',
  // for authorization
  code: 'code',
  // request refresh token
  refresh_token: 'refresh_token',
  //
  resource_owner_password_credentials: 'resource_owner_password_credentials',
} as const;

export type grantType = keyof typeof grantTypes;

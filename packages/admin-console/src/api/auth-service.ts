import BaseAPIClient from './BaseAPIClient'

export class AuthService extends BaseAPIClient {
  // request a token
  authenticate(payload: { email: string; password: string }) {
    const body = {
      ...payload,
      grant_type: 'resource_owner_password_credentials',
      client_id: 'security-admin-console'
    }
    return this.instance.post('/oauth/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
}

import BaseAPIClient from './BaseAPIClient'

export class AuthService extends BaseAPIClient {
  requestAccessToken(payload: { code: string; client_id: string }) {
    const body = {
      ...payload,
      grant_type: 'authorization_code'
    }
    return this.instance.post<{ access_token: string }>('/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
}

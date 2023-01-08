import BaseAPIClient from './BaseAPIClient'

class UserService extends BaseAPIClient {
  fetchUserInfo = () => this.instance('/userinfo')
}
export const userService = new UserService()

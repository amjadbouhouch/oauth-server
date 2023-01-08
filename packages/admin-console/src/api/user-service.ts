import BaseAPIClient from './BaseAPIClient'
import { User } from '@oauth/db-client'

class UserService extends BaseAPIClient {
  fetchUserInfo = () => this.instance.get<User>('/userinfo')
}
export const userService = new UserService()

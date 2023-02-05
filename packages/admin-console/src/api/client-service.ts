import { Client } from '@oauth/core'
import BaseAPIClient from './BaseAPIClient'

class ClientService extends BaseAPIClient {
  list = () => this.instance.get<Client[]>('/clients')
}
export const clientService = new ClientService()

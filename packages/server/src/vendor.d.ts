import { User, AccessToken, Client } from '@oauth/db-client';
import { Container } from 'inversify';

declare module 'express' {
  interface Request {
    user: User;
    accessToken: AccessToken;
    client: Client;
  }
}
declare module 'express-session' {
  interface Session {
    isAuthenticated: boolean;
    userId: string;
  }
}
declare global {
  namespace NodeJS {
    interface Global {
      _container: Container;
    }
  }
}

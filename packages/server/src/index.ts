import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';
import OauthServer from 'oauthServer';

console.clear();

function bootstrap() {
  const app = new OauthServer();
}

bootstrap();

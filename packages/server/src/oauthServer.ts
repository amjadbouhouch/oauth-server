import { OAuthController, UserController } from 'controller';
import express, { NextFunction, Request, Response } from 'express';
import { IOAuthServer } from 'interfaces';
import { InversifyExpressServer } from 'inversify-express-utils';
import { BaseHttpError, DbClient, JwtService } from 'middleware';
import morgan from 'morgan';
import { UserRepository, ClientRepository, AccessTokenRepository } from 'Repository';
import { OauthService, UserService } from 'services';
import { STATUS_CODE } from 'utils/constants';
import cors from 'cors';
import bodyParser from 'body-parser';
export default class OAuthServer extends IOAuthServer {
  //* * */
  async setup() {
    const server = new InversifyExpressServer(this._container);
    server.setErrorConfig((app) => {
      app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        console.error(err);
        if (err instanceof BaseHttpError) {
          res.status(err.statusCode).send(err.message);
        } else {
          res.status(STATUS_CODE.INTERNAL_SERVER).send('internal Server Error');
        }
        // next();
      });
    });

    server.setConfig((app) => {
      app.use(express.json());
      // support application/x-www-form-urlencoded
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(cors(['http://localhost:3000']));
      app.use(morgan('dev'));
    });
    const app = server.build();
    const port = process.env.PORT || 5000;
    const runningServer = app.listen(port, () => {
      console.log(`🚀 server is running on http://localhost:${port}`);
    });
    process.on('SIGTERM', async () => {
      console.debug('SIGTERM signal received: closing HTTP server');
      runningServer.close(async () => {
        console.debug('HTTP server closed');
        const db: DbClient = this._container.get<DbClient>(DbClient);
        await db.disconnect();
        console.debug('disconnecting from database');
      });
    });
  }

  configureService(): void {
    // db stuff
    this._container.bind(DbClient).toSelf();
    // oath
    this._container.bind(OauthService).toSelf();
    this._container.bind(OAuthController).toSelf();
    // users
    this._container.bind(UserRepository).toSelf();
    this._container.bind(UserService).toSelf();
    this._container.bind(UserController).toSelf();
    // client
    this._container.bind(ClientRepository).toSelf();
    // jwt
    this._container.bind(AccessTokenRepository).toSelf();
    this._container.bind(JwtService).toSelf();
  }
}

import bodyParser from 'body-parser';
import { ClientController, OAuthController, UserController, UserInfoController } from 'controller';
import cors from 'cors';
import express, { NextFunction, Response } from 'express';
import { IServer } from 'interfaces';
import { InversifyExpressServer } from 'inversify-express-utils';
import { AccessTokenValidator, BaseHttpError, BCryptService, DbClient, JwtService, SessionManager } from 'middleware';
import morgan from 'morgan';
import { AccessTokenRepository, ClientRepository, UserRepository } from 'Repository';
import { AccessTokenService, ClientService, OauthService, UserService } from 'services';
import { STATUS_CODE } from 'utils/constants';
import path from 'path';
import { AuthenticationController } from 'authentication';
import { AuthorizationController, AuthorizationService } from 'authorization';

export default class Server extends IServer {
  //* * */
  async setup() {
    const server = new InversifyExpressServer(this._container);
    server.setErrorConfig((app) => {
      app.use((err: any, _, res: Response, next: NextFunction) => {
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
      const sessionManager: SessionManager = this._container.get<SessionManager>(SessionManager);
      app.use(sessionManager.session);
      // ejs setup
      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'ejs');
      app.use(express.json());
      app.use(express.static(path.join(__dirname, 'dist')));
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
    // common
    this._container.bind(SessionManager).toSelf();
    this._container.bind(BCryptService).toSelf();
    this._container.bind(JwtService).toSelf();
    this._container.bind(AccessTokenValidator).toSelf();
    // db
    this._container.bind(DbClient).toSelf();
    // repositories
    this._container.bind(UserRepository).toSelf();
    this._container.bind(ClientRepository).toSelf();
    this._container.bind(AccessTokenRepository).toSelf();

    // services
    this._container.bind(UserService).toSelf();
    this._container.bind(ClientService).toSelf();
    this._container.bind(OauthService).toSelf();
    this._container.bind(AccessTokenService).toSelf();
    this._container.bind(AuthorizationService).toSelf();

    // controllers
    this._container.bind(AuthenticationController).toSelf();
    this._container.bind(AuthorizationController).toSelf();
    this._container.bind(UserController).toSelf();
    this._container.bind(UserInfoController).toSelf();
    this._container.bind(ClientController).toSelf();
  }
}

import { AuthenticationController } from 'authentication';
import { AuthorizationController, AuthorizationService } from 'authorization';
import { ClientController, ClientRepository, ClientService } from 'clients';
import { UserController, UserInfoController } from 'controller';
import { IServer } from 'interfaces';
import { InversifyExpressServer } from 'inversify-express-utils';
import { BCryptService, DbClient, JwtService, SessionManager } from 'middleware';
import { AccessTokenRepository, UserRepository } from 'Repository';
import { AccessTokenService, OauthService, UserService } from 'services';

export default class Server extends IServer {
  //* * */
  async setup() {
    const server = new InversifyExpressServer(this._container);
    server.setErrorConfig((app) => this._serverConfig.handleError(app));
    server.setConfig((app) => this._serverConfig.handleConfig(app));
    const app = server.build();
    const port = process.env.PORT || 5000;
    const runningServer = app.listen(port, () => {
      this.logger.info(`🚀 server is running on http://localhost:${port}`);
    });
    process.on('SIGTERM', () => {
      // runningServer.close();
      process.exit();
    });
  }

  configureService(): void {
    // common
    this._container.bind(SessionManager).toSelf();
    this._container.bind(BCryptService).toSelf();
    this._container.bind(JwtService).toSelf();
    // this._container.bind(AccessTokenValidator).toSelf();
    // db
    this._container.bind(DbClient).toSelf();
    // clients
    this._container.bind(ClientRepository).toSelf();
    this._container.bind(ClientService).toSelf();
    this._container.bind(ClientController).toSelf();

    // repositories
    this._container.bind(UserRepository).toSelf();
    this._container.bind(AccessTokenRepository).toSelf();

    // services
    this._container.bind(UserService).toSelf();
    this._container.bind(OauthService).toSelf();
    this._container.bind(AccessTokenService).toSelf();
    this._container.bind(AuthorizationService).toSelf();

    // controllers
    this._container.bind(AuthenticationController).toSelf();
    this._container.bind(AuthorizationController).toSelf();
    this._container.bind(UserController).toSelf();
    this._container.bind(UserInfoController).toSelf();
  }
}

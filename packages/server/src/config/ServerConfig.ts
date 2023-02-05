import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application, NextFunction, Response } from 'express';
import { Container } from 'inversify';
import { BaseHttpError, SessionManager } from 'middleware';
import morgan from 'morgan';
import path from 'path';
import { STATUS_CODE } from 'utils/constants';
import { Logger } from './Logger';

export class ServerConfig {
  private readonly logger = Logger.getLogger(ServerConfig.name);
  constructor(private readonly _container: Container) {}

  public handleError(app: Application) {
    app.use((err: any, _, res: Response, next: NextFunction) => {
      this.logger.error(err.message || err.name, err);
      if (err instanceof BaseHttpError) {
        res.status(err.statusCode).send(err.message);
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER).send('internal Server Error');
      }
    });
  }

  public handleConfig(app: Application) {
    const sessionManager: SessionManager = this._container.get<SessionManager>(SessionManager);
    app.use(sessionManager.session);
    // ejs setup
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../assets')));
    // support application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
    // TODO
    app.use(cors(['http://localhost:3000']));
    app.use(morgan('dev'));
  }
}

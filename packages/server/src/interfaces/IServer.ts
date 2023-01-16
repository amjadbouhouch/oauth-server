import { Container, interfaces } from 'inversify';

export type ApplicationOptionsType = {
  inversifyOptions?: interfaces.ContainerOptions;
};
const defaultOptions: ApplicationOptionsType = {
  inversifyOptions: {
    defaultScope: 'Singleton',
  },
};
export abstract class IServer {
  protected readonly _container: Container;

  constructor(options: ApplicationOptionsType = defaultOptions) {
    this._container = new Container({
      ...defaultOptions.inversifyOptions,
      ...options.inversifyOptions,
    });
    global._container = this._container;
    this.configureService();
    this.setup(options);
    return this;
  }

  abstract configureService(): void;

  abstract setup(options: ApplicationOptionsType): Promise<void> | void;
}

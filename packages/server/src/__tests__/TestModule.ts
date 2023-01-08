import { ContainerModule } from 'inversify';
import { BCryptService, JwtService } from '../middleware';

export default class TestModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind<JwtService>(JwtService).toSelf();
      bind<BCryptService>(BCryptService).toSelf();
    });
  }
}

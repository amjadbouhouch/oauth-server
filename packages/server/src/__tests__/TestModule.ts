import { JwtService } from './../middleware/jwtService';
import { ContainerModule } from 'inversify';

export default class TestModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind<JwtService>(JwtService).toSelf();
    });
  }
}

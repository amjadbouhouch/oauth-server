import { JwtService } from 'middleware';
import { createTestingModule } from './createTestingModule';
import TestModule from './TestModule';

describe('JwtService', () => {
  let instance: JwtService;
  beforeEach(() => {
    const container = createTestingModule(TestModule);
    instance = container.get(JwtService);
  });
  afterAll((done) => {
    done();
  });
  test('jwt secret should be defined', () => {
    //@ts-ignore
    expect(instance.jwtSecret).toBeDefined();
  });
  test('sign token output should be defined', async () => {
    const payload = {
      email: 'test@test.com',
    };
    const token = instance.generateToken(payload);
    expect(token).toBeDefined();
    const decoded = instance.verify(token);
    expect(decoded.email).toBe(payload.email);
  });
});

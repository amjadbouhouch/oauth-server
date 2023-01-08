import { BCryptService } from '../middleware/BCryptService';
import { createTestingModule } from './createTestingModule';
import TestModule from './TestModule';

describe('BCryptService', () => {
  let instance: BCryptService;

  beforeEach(() => {
    const container = createTestingModule(TestModule);
    instance = container.get(BCryptService);
  });
  afterAll((done) => {
    done();
  });
  test('hashPassword should be defined & matched', async () => {
    const password = '123456';
    const hashedPassword = await instance.hash(password);
    expect(hashedPassword).toBeDefined();
    const isMatched = await instance.compare(password, hashedPassword);
    expect(isMatched).toBe(true);
  });
});

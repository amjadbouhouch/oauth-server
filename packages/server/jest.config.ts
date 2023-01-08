export default {
  coverageProvider: 'v8',
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./setup-tests.ts'],
  testRegex: '/src/__tests__/.*.spec.ts$',
};

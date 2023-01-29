import packageJson from '../../package.json'

if (window) {
  window.appVersion = packageJson.version
  window.mode = import.meta.env.MODE
}

export class CONSTANTS {
  static readonly MODE = import.meta.env.MODE

  static readonly IN_DEV_MODE = import.meta.env.MODE === 'development'
  static readonly IN_TEST_MODE = import.meta.env.MODE === 'staging'
  static readonly IN_PROD_MODE = import.meta.env.MODE === 'production'
}

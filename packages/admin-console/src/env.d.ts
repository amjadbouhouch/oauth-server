/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly MODE: 'development' | 'staging' | 'production'
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

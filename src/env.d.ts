/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly DEV: boolean
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 
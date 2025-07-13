import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  // 获取后端URL，默认为http://localhost:5000
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:5000'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path
        }
      }
    },
    // 定义环境变量
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(backendUrl)
    }
  }
}) 
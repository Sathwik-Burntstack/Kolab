import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Optional dev proxy: set VITE_DEV_PROXY_TARGET=http://localhost:8000 in .env
// and set VITE_API_BASE_URL=/api to avoid CORS during development.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_DEV_PROXY_TARGET
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: target ? { '/api': { target, changeOrigin: true } } : undefined,
    },
  }
})

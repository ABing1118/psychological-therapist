import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { getCurrentConfig, buildUrl } from './config/environments.js'

// 获取当前环境配置
const config = getCurrentConfig()

export default defineConfig({
  plugins: [react()],
  server: {
    port: config.frontend.port,
    host: config.frontend.host,
    proxy: {
      '/api': {
        target: buildUrl('backend'),
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
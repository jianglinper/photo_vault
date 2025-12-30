import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import imageScanner from './src/utils/vite-plugin-image-scanner.js'
import randomApi from './src/utils/vite-plugin-random-api.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), imageScanner(), randomApi()],
  server: {
    rewrites: [
      // 除了/api/开头的路径和静态资源文件外，其他路径都重写到index.html
      { 
        from: /^(?!\/api\/|\/src\/|\/node_modules\/|.*\.(js|css|png|jpg|jpeg|gif|svg|ico)$).*/, 
        to: '/index.html' 
      }
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})

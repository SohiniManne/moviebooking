import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
    hmr: {
      overlay: false
    }
  },
  css: {
    postcss: './postcss.config.js'
  }
})

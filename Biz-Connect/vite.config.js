import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/,''),
      },
    },
  },
  plugins: [
    react(),
    vue()
  ],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { qrcode } from 'vite-plugin-qrcode'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), qrcode()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
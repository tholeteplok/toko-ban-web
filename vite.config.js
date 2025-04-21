// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  base: '/toko-ban-web/', // GANTI sesuai nama repo GitHub kamu
  plugins: [react()],
  server: {
    port: 3000, // port lokal
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // opsional, memudahkan import dengan "@"
    }
  }
})

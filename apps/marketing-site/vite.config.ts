import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '../../dist/marketing-site',
    sourcemap: false,
  },
  server: {
    port: 5175,
    host: true,
  },
  preview: {
    port: 4175,
    host: true,
  }
})


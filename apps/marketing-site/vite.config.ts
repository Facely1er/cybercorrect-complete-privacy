import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // Explicitly set root to current directory (app folder)
  root: __dirname,
  // Explicitly define public directory
  publicDir: path.resolve(__dirname, './public'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Explicitly set output directory (separate from source)
    outDir: path.resolve(__dirname, './dist'),
    sourcemap: false,
    emptyOutDir: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
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


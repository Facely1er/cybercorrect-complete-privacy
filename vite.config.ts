import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vitejs.dev/config/
import type { Plugin } from 'vite';

export default defineConfig(({ mode }) => {
  const plugins: Plugin[] = [
    react(),
  ];

  // Only add Sentry plugin if env vars are configured
  if (process.env.SENTRY_ORG && process.env.SENTRY_PROJECT && process.env.SENTRY_AUTH_TOKEN) {
    plugins.push(
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        sourcemaps: {
          assets: './dist/**',
        },
        release: {
          name: process.env.SENTRY_RELEASE || 'cybercorrect@1.0.0',
        },
      })
    );
  }

  return {
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Use inline source maps in development for better debugging, no source maps in production
    sourcemap: mode === 'production' ? false : 'inline',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - core dependencies
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            // React Router
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            // UI libraries
            if (id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            // Chart libraries
            if (id.includes('chart.js') || id.includes('react-chartjs-2') || id.includes('recharts')) {
              return 'vendor-charts';
            }
            // PDF libraries
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'vendor-pdf';
            }
            // Other vendor dependencies
            return 'vendor';
          }
        },
        // Ensure consistent chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    host: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  preview: {
    port: 4173,
    host: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
  };
  });
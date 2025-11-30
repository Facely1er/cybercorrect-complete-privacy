import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
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
    // Explicitly set root to current directory (app folder)
    root: __dirname,
    // Explicitly define public directory
    publicDir: path.resolve(__dirname, './public'),
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      // Explicitly set output directory (separate from source)
      outDir: path.resolve(__dirname, './dist'),
      // Use inline source maps in development for better debugging, no source maps in production
      sourcemap: mode === 'production' ? false : 'inline',
      // Performance optimizations
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production', // Remove console.log in production
          drop_debugger: mode === 'production',
        },
      },
      // Chunk size optimization
      chunkSizeWarningLimit: 1000,
      // Asset optimization
      assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - core dependencies
          if (id.includes('node_modules')) {
            // Keep React and React DOM in main bundle to ensure they're loaded before any code uses them
            // This prevents "Cannot read properties of undefined (reading 'createContext')" errors
            if (id.includes('react') || id.includes('react-dom')) {
              return undefined; // Keep in main bundle
            }
            // React Router - can be split since React will be loaded first
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
          // Don't split context files - keep them in main bundle to ensure React is loaded
          // Returning null/undefined means they stay in the main bundle
        },
        // Ensure consistent chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
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
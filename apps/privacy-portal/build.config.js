/**
 * Build Configuration for Privacy Portal
 * 
 * This configuration explicitly defines source and output directories
 * to ensure builds are created from a separate source folder.
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const buildConfig = {
  // Source directory - where source files are located
  sourceDir: path.resolve(__dirname, './src'),
  
  // Public directory - static assets that are copied as-is
  publicDir: path.resolve(__dirname, './public'),
  
  // Output directory - where built files are written
  outputDir: path.resolve(__dirname, './dist'),
  
  // Root directory - the app root
  rootDir: __dirname,
  
  // Entry point - main entry file
  entryPoint: path.resolve(__dirname, './src/main.tsx'),
  
  // HTML template
  htmlTemplate: path.resolve(__dirname, './index.html'),
  
  // TypeScript config
  tsConfig: path.resolve(__dirname, './tsconfig.json'),
  
  // Package.json location
  packageJson: path.resolve(__dirname, './package.json'),
  
  // Build output structure
  output: {
    // JavaScript files
    js: 'assets/js/[name]-[hash].js',
    // CSS files
    css: 'assets/css/[name]-[hash].css',
    // Images
    images: 'assets/images/[name]-[hash].[ext]',
    // Fonts
    fonts: 'assets/fonts/[name]-[hash].[ext]',
    // Other assets
    assets: 'assets/[name]-[hash].[ext]'
  },
  
  // Environment-specific paths
  env: {
    development: {
      sourceMap: true,
      minify: false
    },
    production: {
      sourceMap: false,
      minify: true,
      optimize: true
    }
  }
};

export default buildConfig;


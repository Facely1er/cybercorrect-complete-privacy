#!/usr/bin/env node

// Image optimization script for production builds
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const logosDir = path.join(publicDir, 'logos');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.log('Sharp not available, skipping image optimization');
  process.exit(0);
}

async function optimizeImage(inputPath, outputDir, formats = ['webp', 'avif']) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  
  for (const format of formats) {
    const outputPath = path.join(outputDir, `${filename}.${format}`);
    
    try {
      await sharp(inputPath)
        .resize(800, 600, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .toFormat(format, {
          quality: format === 'webp' ? 80 : 70,
          effort: format === 'avif' ? 4 : undefined
        })
        .toFile(outputPath);
      
      console.log(`✓ Generated ${format.toUpperCase()}: ${outputPath}`);
    } catch (error) {
      console.error(`✗ Failed to generate ${format.toUpperCase()}:`, error.message);
    }
  }
}

async function optimizeImages() {
  console.log('🖼️  Optimizing images...');
  
  if (!fs.existsSync(logosDir)) {
    console.log('No logos directory found, skipping image optimization');
    return;
  }
  
  const files = fs.readdirSync(logosDir)
    .filter(file => /\.(png|jpg|jpeg)$/i.test(file));
  
  if (files.length === 0) {
    console.log('No image files found to optimize');
    return;
  }
  
  for (const file of files) {
    const inputPath = path.join(logosDir, file);
    console.log(`Processing: ${file}`);
    
    // Generate WebP and AVIF versions
    await optimizeImage(inputPath, logosDir, ['webp', 'avif']);
  }
  
  console.log('✅ Image optimization complete');
}

// Run optimization
optimizeImages().catch(console.error);
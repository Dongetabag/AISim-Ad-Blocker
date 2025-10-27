#!/usr/bin/env node

// AISim AdBlocker - Build Script

const fs = require('fs');
const path = require('path');

console.log('🔨 Building AISim AdBlocker...\n');

const distDir = path.join(__dirname, '..', 'dist');

// Clean dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
  console.log('✓ Cleaned dist directory');
}

// Create dist directory
fs.mkdirSync(distDir, { recursive: true });
console.log('✓ Created dist directory');

// Copy files to dist
const filesToCopy = [
  'manifest.json',
  'background',
  'content',
  'popup',
  'options',
  'rules',
  'icons'
];

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

filesToCopy.forEach(item => {
  const srcPath = path.join(__dirname, '..', item);
  const destPath = path.join(distDir, item);
  
  if (fs.existsSync(srcPath)) {
    copyRecursive(srcPath, destPath);
    console.log(`✓ Copied ${item}`);
  } else {
    console.warn(`⚠ ${item} not found, skipping`);
  }
});

// Read manifest version
const manifest = JSON.parse(fs.readFileSync(path.join(distDir, 'manifest.json'), 'utf8'));
console.log(`\n✅ Build complete! Version: ${manifest.version}`);
console.log(`📦 Output: ${distDir}`);

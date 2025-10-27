#!/usr/bin/env node

// AISim AdBlocker - Pack Script

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

console.log('📦 Packing AISim AdBlocker...\n');

// Run build first
require('./build.js');

const distDir = path.join(__dirname, '..', 'dist');
const outputDir = path.join(__dirname, '..', 'releases');
const manifest = JSON.parse(fs.readFileSync(path.join(distDir, 'manifest.json'), 'utf8'));
const version = manifest.version;
const outputFile = path.join(outputDir, `aisim-adblocker-v${version}.zip`);

// Create releases directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create ZIP archive
const output = fs.createWriteStream(outputFile);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', function() {
  const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`\n✅ Package created successfully!`);
  console.log(`📦 File: ${outputFile}`);
  console.log(`📊 Size: ${sizeInMB} MB`);
  console.log(`\n🚀 Ready to upload to Chrome Web Store!`);
});

archive.on('error', function(err) {
  console.error('❌ Error creating archive:', err);
  process.exit(1);
});

archive.pipe(output);
archive.directory(distDir, false);
archive.finalize();

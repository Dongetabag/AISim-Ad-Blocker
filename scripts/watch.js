#!/usr/bin/env node

// AISim AdBlocker - Watch Script

const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

console.log('👀 Watching for changes...\n');

// Run initial build
exec('npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Build error:', error);
    return;
  }
  console.log(stdout);
});

// Watch for changes
const watcher = chokidar.watch([
  'manifest.json',
  'background/**/*.js',
  'content/**/*.js',
  'popup/**/*',
  'options/**/*',
  'rules/**/*.json'
], {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true
});

let buildTimeout;

watcher.on('change', (filePath) => {
  console.log(`\n📝 Changed: ${filePath}`);
  
  // Debounce builds
  clearTimeout(buildTimeout);
  buildTimeout = setTimeout(() => {
    console.log('🔨 Rebuilding...');
    exec('npm run build', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Build error:', error);
        return;
      }
      console.log('✅ Build complete!');
    });
  }, 500);
});

console.log('✓ Watching for file changes...');
console.log('  Press Ctrl+C to stop\n');

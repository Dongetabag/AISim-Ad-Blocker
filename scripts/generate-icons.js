#!/usr/bin/env node

// AISim AdBlocker - Icon Generation Script

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

console.log('🎨 Generating icons...\n');

const iconsDir = path.join(__dirname, '..', 'icons');

// Create icons directory
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create SVG icon (base)
const svgIcon = `
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="24" fill="url(#grad)" />
  <text x="64" y="90" font-size="72" text-anchor="middle" fill="white">🛡️</text>
</svg>
`;

const svgIconDisabled = `
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="24" fill="#999999" />
  <text x="64" y="90" font-size="72" text-anchor="middle" fill="white">🛡️</text>
</svg>
`;

// Save SVG icons
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);
fs.writeFileSync(path.join(iconsDir, 'icon-disabled.svg'), svgIconDisabled);

// Generate PNG icons in different sizes
const sizes = [16, 48, 128];

async function generateIcons() {
  for (const size of sizes) {
    // Active icon
    await sharp(Buffer.from(svgIcon))
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `icon${size}.png`));
    
    console.log(`✓ Generated icon${size}.png`);
    
    // Disabled icon
    await sharp(Buffer.from(svgIconDisabled))
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `icon${size}-disabled.png`));
    
    console.log(`✓ Generated icon${size}-disabled.png`);
  }
  
  console.log('\n✅ All icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('❌ Error generating icons:', err);
  process.exit(1);
});

# Icons Directory

This directory contains the extension icons.

## Generating PNG Icons

The SVG icon is provided, but PNG versions need to be generated.

Run the following command to generate all required PNG icons:

```bash
npm run generate-icons
```

This will create:
- icon16.png (16x16)
- icon48.png (48x48)
- icon128.png (128x128)
- icon16-disabled.png
- icon48-disabled.png
- icon128-disabled.png

## Manual Generation (if npm script fails)

You can use any SVG to PNG converter:
- ImageMagick: `convert icon.svg -resize 128x128 icon128.png`
- Online tools like cloudconvert.com
- Or any image editing software (GIMP, Photoshop, etc.)

## Note

The icon.svg file is provided as a template. You can customize the design as needed.

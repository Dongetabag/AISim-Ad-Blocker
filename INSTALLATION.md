# 🚀 Installation Guide for AISim AdBlocker

This guide will walk you through installing and setting up the AISim AdBlocker Chrome extension.

## Prerequisites

- **Google Chrome** (or Chromium-based browser)
- **Node.js** version 18 or higher (for building)
- **Docker** (optional, for containerized development)
- **Git** (optional, for cloning)

## Method 1: Quick Install with Docker (Recommended for Beginners)

### Step 1: Ensure Docker is Installed

```bash
# Check if Docker is installed
docker --version

# If not installed, visit: https://docs.docker.com/get-docker/
```

### Step 2: Navigate to Project Directory

```bash
cd aisim-adblocker
```

### Step 3: Build with Docker

```bash
# Build and run using Docker Compose
docker-compose --profile build up aisim-adblocker-build

# This will create the dist/ folder with the built extension
```

### Step 4: Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top right)
3. Click **Load unpacked**
4. Navigate to the `aisim-adblocker/dist` folder
5. Click **Select Folder**

✅ The extension is now installed!

## Method 2: Local Build (For Developers)

### Step 1: Install Node.js

Download and install Node.js 18+ from: https://nodejs.org/

Verify installation:
```bash
node --version  # Should be v18.0.0 or higher
npm --version
```

### Step 2: Navigate to Project Directory

```bash
cd aisim-adblocker
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages from `package.json`.

### Step 4: Generate Icons

```bash
npm run generate-icons
```

This creates all icon sizes (16x16, 48x48, 128x128) in the `icons/` folder.

### Step 5: Build the Extension

```bash
npm run build
```

This creates the `dist/` folder with the production-ready extension.

### Step 6: Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top right)
3. Click **Load unpacked**
4. Navigate to the `aisim-adblocker/dist` folder
5. Click **Select Folder**

✅ The extension is now installed!

## Method 3: Development Mode with Auto-Reload

For active development with automatic rebuilds:

### Step 1: Install Dependencies (if not already done)

```bash
npm install
npm run generate-icons
```

### Step 2: Start Development Watcher

```bash
npm run dev
```

This watches for file changes and automatically rebuilds the extension.

### Step 3: Load Extension in Chrome

Follow the same steps as above to load the `dist/` folder.

### Step 4: Reload Extension After Changes

After making changes:
1. The extension auto-rebuilds (watch the terminal)
2. Go to `chrome://extensions/`
3. Click the **reload** icon on the AISim AdBlocker card

## Verifying Installation

Once installed, you should see:

1. **Extension Icon**: 🛡️ icon in Chrome toolbar
2. **Badge**: Shows number of blocked items on each page
3. **Popup**: Click icon to see statistics

### Test the Extension

1. Visit any website with ads (e.g., news sites)
2. Click the extension icon
3. You should see blocked ad/tracker counts

## Troubleshooting

### Issue: "Cannot load extension" error

**Solution**: Make sure you've run `npm run build` and the `dist/` folder exists.

### Issue: Icons not displaying

**Solution**: Run `npm run generate-icons` before building.

### Issue: Extension not blocking ads

**Solutions**:
- Check if the site is whitelisted (click icon → check whitelist status)
- Reload the page after installing the extension
- Try clearing browser cache
- Update filter lists in Settings

### Issue: npm install fails

**Solutions**:
- Ensure Node.js 18+ is installed
- Try removing `node_modules/` and `package-lock.json`, then run `npm install` again
- Check your internet connection

### Issue: Docker build fails

**Solutions**:
- Ensure Docker is running: `docker ps`
- Try rebuilding without cache: `docker-compose build --no-cache`
- Check Docker disk space: `docker system df`

## Development Commands Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run generate-icons` | Generate icon files |
| `npm run build` | Build extension once |
| `npm run dev` | Build and watch for changes |
| `npm run pack` | Create distributable ZIP file |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Lint code with ESLint |

## Docker Commands Reference

| Command | Description |
|---------|-------------|
| `docker-compose up` | Start dev environment |
| `docker-compose --profile build up aisim-adblocker-build` | Build extension |
| `docker-compose down` | Stop and remove containers |
| `docker-compose build --no-cache` | Rebuild from scratch |

## Updating the Extension

### After Code Changes

1. Save your changes
2. If using `npm run dev`, it auto-rebuilds
3. If not, run `npm run build`
4. Go to `chrome://extensions/`
5. Click reload icon on AISim AdBlocker

### Pulling Latest Updates

```bash
git pull origin main
npm install  # Install any new dependencies
npm run build
# Reload extension in Chrome
```

## Uninstalling

1. Go to `chrome://extensions/`
2. Find AISim AdBlocker
3. Click **Remove**
4. Confirm removal

To reinstall, follow the installation steps again.

## Production Deployment

To create a ZIP file for Chrome Web Store:

```bash
npm run pack
```

This creates: `releases/aisim-adblocker-v1.0.0.zip`

Upload this file to the Chrome Web Store Developer Dashboard.

## Getting Help

If you encounter issues:

1. Check this installation guide thoroughly
2. Review the main README.md
3. Check existing GitHub issues
4. Create a new issue with:
   - Your operating system
   - Node.js version (`node --version`)
   - Chrome version
   - Exact error messages
   - Steps to reproduce

## Next Steps

After installation:

1. **Configure Settings**: Click extension icon → Settings
2. **Check Statistics**: View blocked ads/trackers
3. **Manage Whitelist**: Add trusted sites
4. **Add Custom Filters**: Create your own blocking rules

Enjoy your ad-free browsing! 🎉

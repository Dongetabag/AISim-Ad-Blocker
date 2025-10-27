# ⚡ Quick Start Guide - AISim AdBlocker

Get up and running in 5 minutes!

## 🎯 Fastest Way to Install

### Option 1: With Docker (No Node.js needed)

```bash
# 1. Navigate to the project
cd aisim-adblocker

# 2. Build with Docker
docker-compose --profile build up aisim-adblocker-build

# 3. Load in Chrome
# - Open chrome://extensions/
# - Enable "Developer mode"
# - Click "Load unpacked"
# - Select the "dist" folder
```

### Option 2: With Node.js

```bash
# 1. Navigate to the project
cd aisim-adblocker

# 2. Install and build
npm install
npm run generate-icons
npm run build

# 3. Load in Chrome
# - Open chrome://extensions/
# - Enable "Developer mode"  
# - Click "Load unpacked"
# - Select the "dist" folder
```

## ✅ Verify It's Working

1. **Look for the icon**: 🛡️ in your Chrome toolbar
2. **Visit a website**: Go to any news site
3. **Click the icon**: See blocked ads counter
4. **Check badge**: Number appears showing blocked items

## 🎨 First Steps

### View Statistics
Click the extension icon to see:
- Ads blocked on current page
- Trackers blocked
- Bandwidth saved
- Total statistics

### Open Settings
1. Click extension icon
2. Click "⚙️ Settings"
3. Configure:
   - Filter lists
   - Whitelist domains
   - Custom filters
   - View total stats

### Whitelist a Site
1. Visit the site
2. Click extension icon
3. Click "Add to Whitelist"
4. Page reloads with ads allowed

## 🐛 Quick Troubleshooting

**Extension won't load?**
- Make sure you built it: `npm run build` or use Docker
- Check that `dist/` folder exists

**No icons showing?**
- Run: `npm run generate-icons`
- Or use Docker build which handles this automatically

**Ads not blocked?**
- Check if site is whitelisted
- Reload the page
- Update filter lists in Settings

## 📚 Next Steps

- Read the full [README.md](README.md) for details
- Check [INSTALLATION.md](INSTALLATION.md) for comprehensive setup
- Customize settings to your preferences
- Add custom filters for specific sites

## 🚀 Development Mode

For active development:

```bash
npm run dev  # Auto-rebuilds on file changes
```

Then reload extension in Chrome after each change.

## 💡 Tips

- **Badge shows count**: Number of blocked items on current page
- **Green checkmark**: Site is whitelisted
- **Statistics reset**: Available in Settings page
- **Custom filters**: Use standard ad-blocking syntax

---

That's it! You're ready to enjoy ad-free browsing! 🎉

For help, check README.md or open an issue on GitHub.

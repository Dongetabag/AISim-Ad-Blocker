# 🛡️ AISim AdBlocker

An advanced, high-performance Chrome extension for blocking ads and trackers without freezing pages.

## ✨ Features

- **🚀 High Performance**: Uses Chrome's declarativeNetRequest API for maximum speed
- **🎯 Advanced Blocking**: Multi-layer blocking (network, DOM, and JavaScript level)
- **🔒 Privacy Protection**: Blocks trackers, analytics, and fingerprinting
- **📊 Detailed Statistics**: Track blocked ads, trackers, and bandwidth saved
- **⚡ No Page Freezing**: Optimized to prevent the page freeze issues common with other ad blockers
- **🎨 Beautiful UI**: Modern, gradient-based interface with real-time stats
- **🌐 Whitelist Management**: Easily whitelist domains you trust
- **🔧 Custom Filters**: Add your own blocking rules
- **📦 Filter Lists**: Built-in EasyList and EasyPrivacy support
- **🐳 Docker Development**: Complete Docker setup for development

## 🚀 Quick Start

### Installation (Development Mode)

1. **Clone or download this repository**

2. **Install with Docker (Recommended):**

```bash
# Build and run with Docker Compose
docker-compose up

# Or manually with Docker
docker build -t aisim-adblocker .
docker run -v $(pwd):/app aisim-adblocker npm run build
```

3. **Or install locally:**

```bash
# Install dependencies
npm install

# Generate icons
npm run generate-icons

# Build the extension
npm run build
```

4. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist` folder

### Production Build

```bash
# Build and create ZIP file for Chrome Web Store
npm run pack

# Output will be in releases/aisim-adblocker-v1.0.0.zip
```

## 🔧 Development

### Using Docker (Recommended)

```bash
# Start development environment with hot reload
docker-compose up

# Build production version
docker-compose --profile build up aisim-adblocker-build
```

### Local Development

```bash
# Watch mode (auto-rebuild on changes)
npm run dev

# Build once
npm run build

# Format code
npm run format

# Lint code
npm run lint
```

### CLI Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development with file watching |
| `npm run build` | Build extension to dist/ folder |
| `npm run pack` | Build and create ZIP for distribution |
| `npm run generate-icons` | Generate icon files in multiple sizes |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Lint code with ESLint |

## 📁 Project Structure

```
aisim-adblocker/
├── manifest.json              # Extension manifest (Manifest V3)
├── background/                # Background service worker
│   ├── service-worker.js      # Main background script
│   ├── filter-manager.js      # Filter list management
│   ├── stats-manager.js       # Statistics tracking
│   └── storage-manager.js     # Storage operations
├── content/                   # Content scripts
│   ├── content-script.js      # DOM-level ad blocking
│   └── injected.js            # Page-context blocking
├── popup/                     # Extension popup
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── options/                   # Settings page
│   ├── options.html
│   ├── options.js
│   └── options.css
├── rules/                     # Blocking rules (JSON)
│   ├── easylist.json         # EasyList rules
│   ├── easyprivacy.json      # EasyPrivacy rules
│   ├── custom.json           # User custom rules
│   └── whitelist.json        # Whitelist rules
├── icons/                     # Extension icons
├── scripts/                   # Build scripts
│   ├── build.js              # Build script
│   ├── pack.js               # Packaging script
│   ├── watch.js              # Development watcher
│   └── generate-icons.js     # Icon generator
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose config
└── package.json              # NPM dependencies
```

## 🎯 How It Works

### Multi-Layer Blocking Strategy

1. **Network Level (declarativeNetRequest)**
   - Fastest blocking method
   - Intercepts requests before they're sent
   - No performance impact on page load

2. **DOM Level (Content Scripts)**
   - Removes ad elements from the page
   - Uses MutationObserver for dynamic content
   - Hides elements with ad-related classes/IDs

3. **JavaScript Level (Injected Scripts)**
   - Blocks ad-related JavaScript APIs
   - Prevents tracking scripts from executing
   - Intercepts fetch/XHR requests

### Performance Optimization

- **Declarative blocking**: Uses Chrome's built-in engine for maximum speed
- **Debounced DOM scanning**: Prevents excessive CPU usage
- **Efficient selectors**: Optimized CSS selectors for fast matching
- **Minimal memory footprint**: Lazy loading and garbage collection
- **No page freezing**: All operations are asynchronous

## 📊 Statistics Tracking

The extension tracks:
- Total ads blocked
- Total trackers blocked
- Bandwidth saved (estimated)
- Pages optimized
- Per-page blocking statistics

Access statistics via:
- Extension popup (per-page stats)
- Settings page (total stats)

## 🎨 Customization

### Custom Filter Rules

Add custom blocking rules in the Settings page. Supported formats:

```
||example.com/ads^          # Block ads from example.com
##.advertisement            # Hide elements with class "advertisement"
example.com##.banner        # Hide banners on example.com
/tracking/                  # Block URLs containing /tracking/
```

### Whitelist Domains

Disable ad blocking on specific domains:
1. Click the extension icon
2. Click "Add to Whitelist" for current domain
3. Or manage all whitelisted domains in Settings

## 🔒 Privacy

AISim AdBlocker:
- ✅ Does NOT collect any user data
- ✅ Does NOT track browsing history
- ✅ Does NOT send data to external servers
- ✅ All processing happens locally on your device
- ✅ Open source and auditable

## 🐛 Troubleshooting

### Extension not loading
- Make sure you've built the extension (`npm run build`)
- Check that the `dist` folder exists
- Enable Developer mode in chrome://extensions

### Icons not showing
- Run `npm run generate-icons` to generate icon files
- Icons require the `sharp` npm package

### Ads not being blocked
- Check if the site is whitelisted
- Try updating filter lists in Settings
- Some ads may bypass network-level blocking (will be caught at DOM level)

### Page performance issues
- Report the specific site where you experience issues
- Try disabling other extensions to isolate the problem
- The extension is optimized to prevent freezing, but site-specific issues may occur

## 📝 Development Notes

### Adding New Filter Rules

1. Edit the appropriate JSON file in `rules/`
2. Follow the declarativeNetRequest format
3. Rebuild the extension

### Modifying UI

- Popup: Edit files in `popup/`
- Settings: Edit files in `options/`
- Styles use modern CSS with gradients

### Testing

Currently, automated tests are not implemented. To test:
1. Load extension in Chrome
2. Visit various websites
3. Check blocking statistics
4. Test whitelist functionality
5. Verify settings persistence

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use and modify!

## 🙏 Acknowledgments

- EasyList and EasyPrivacy for filter lists
- Chrome Extensions API documentation
- The open-source ad blocking community

## 📞 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check existing issues for solutions

## 🚀 Roadmap

- [ ] Automated filter list updates
- [ ] More filter list options
- [ ] Import/export settings
- [ ] Sync settings across devices
- [ ] Advanced statistics dashboard
- [ ] Performance profiling tools
- [ ] Browser action context menu
- [ ] Keyboard shortcuts
- [ ] Theme customization

---

Made with ❤️ by AISim

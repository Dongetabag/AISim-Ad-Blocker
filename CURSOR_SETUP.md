# 🎯 Setting Up AISim AdBlocker in Cursor IDE

This guide will help you set up and develop the AISim AdBlocker extension using Cursor IDE.

## 📋 Prerequisites

- **Cursor IDE** installed ([download here](https://cursor.sh/))
- **Node.js** 18+ installed
- **Google Chrome** browser
- **Git** (optional, for version control)

## 🚀 Quick Setup in Cursor

### Step 1: Open Project in Cursor

1. Launch Cursor IDE
2. File → Open Folder
3. Select the `aisim-adblocker` folder
4. Click "Open"

### Step 2: Trust the Workspace

If prompted, click "**Yes, I trust the authors**" to enable all features.

### Step 3: Install Dependencies

Open Cursor's integrated terminal (`` Ctrl+` `` or `Cmd+` on Mac):

```bash
npm install
```

### Step 4: Generate Icons

```bash
npm run generate-icons
```

### Step 5: Build the Extension

```bash
npm run build
```

### Step 6: Load in Chrome

1. Open Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `aisim-adblocker/dist` folder

## 🛠️ Development Workflow in Cursor

### Using Terminal Commands

Cursor's integrated terminal (`` Ctrl+` ``) supports all npm commands:

```bash
# Start development mode (auto-rebuild on changes)
npm run dev

# Build once
npm run build

# Create production ZIP
npm run pack

# Format code
npm run format

# Lint code
npm run lint
```

### Recommended Cursor Settings

Add these to your `.vscode/settings.json` (Cursor uses VS Code settings):

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.js": "javascript"
  },
  "javascript.format.enable": true,
  "javascript.validate.enable": true
}
```

### Using Cursor AI Features

1. **Code Completion**
   - Cursor AI provides intelligent autocomplete
   - Press `Tab` to accept suggestions

2. **Chat with AI** (Cmd+K / Ctrl+K)
   - Ask questions about the code
   - Request refactoring suggestions
   - Debug issues

3. **Command Palette** (Cmd+Shift+P / Ctrl+Shift+P)
   - Quick access to all commands
   - Search for "Format Document"
   - Search for "ESLint: Fix all auto-fixable problems"

## 📁 Project Structure in Cursor

### Important Files to Know

```
aisim-adblocker/
├── manifest.json              # Extension config (start here!)
├── background/                # Background service worker
│   └── service-worker.js      # Main logic
├── content/                   # Content scripts (DOM blocking)
├── popup/                     # Extension popup UI
├── options/                   # Settings page
├── rules/                     # Blocking rules (JSON)
├── scripts/                   # Build scripts
└── package.json              # npm configuration
```

### Quick Navigation in Cursor

- **Cmd+P / Ctrl+P**: Quick file search
- **Cmd+Shift+F / Ctrl+Shift+F**: Search across all files
- **Cmd+Click / Ctrl+Click**: Jump to definition

## 🔄 Development Cycle

### 1. Start Dev Mode

```bash
npm run dev
```

This watches for file changes and auto-rebuilds.

### 2. Make Your Changes

Edit any file in Cursor. The watcher will detect changes.

### 3. Reload Extension in Chrome

After changes:
1. Go to `chrome://extensions/`
2. Find AISim AdBlocker
3. Click the reload icon (🔄)

### 4. Test Your Changes

Visit a website and test the functionality.

## 🐛 Debugging in Cursor

### Console Logging

Add console logs in your code:

```javascript
console.log('AISim AdBlocker: Debug info');
```

View logs:
- **Background scripts**: Chrome → Extensions → AISim AdBlocker → "service worker"
- **Content scripts**: Chrome DevTools Console (F12) on any page
- **Popup**: Right-click popup → "Inspect"

### Chrome DevTools

1. Background worker: `chrome://extensions/` → Details → "Inspect views: service worker"
2. Content script: F12 on any webpage
3. Popup: Right-click extension icon → Inspect

### Cursor Debugging

Cursor doesn't directly debug Chrome extensions, but you can:
1. Use Chrome DevTools for runtime debugging
2. Use Cursor for code inspection and AI-assisted debugging
3. Add breakpoints in Chrome DevTools

## 💡 Cursor Pro Tips

### 1. Use Cursor's AI Chat

Press `Cmd+K / Ctrl+K` and ask:
- "Explain how the filter manager works"
- "Optimize this blocking function"
- "Find potential bugs in this code"
- "Refactor this component"

### 2. Multi-Cursor Editing

- `Cmd+D / Ctrl+D`: Select next occurrence
- `Cmd+Shift+L / Ctrl+Shift+L`: Select all occurrences
- `Alt+Click`: Add cursor at position

### 3. Code Folding

- `Cmd+Opt+[ / Ctrl+Alt+[`: Fold code block
- `Cmd+Opt+] / Ctrl+Alt+]`: Unfold code block

### 4. Split Editor

- `Cmd+\ / Ctrl+\`: Split editor
- Work on multiple files side-by-side

## 🔧 Recommended Cursor Extensions

Install these from Cursor's extension marketplace:

1. **ESLint** - JavaScript linting
2. **Prettier** - Code formatting
3. **GitLens** - Git supercharged (if using Git)
4. **Error Lens** - Inline error messages
5. **Path Intellisense** - Autocomplete file paths

## 🎨 Customizing the Extension in Cursor

### Modifying the UI

**Popup UI:**
1. Open `popup/popup.html`
2. Edit HTML structure
3. Open `popup/popup.css`
4. Modify styles
5. Open `popup/popup.js`
6. Update functionality

**Options Page:**
Similar process with files in `options/` folder.

### Adding New Features

1. Plan feature in comments
2. Use Cursor AI to help with implementation
3. Add to appropriate module
4. Test thoroughly
5. Update documentation

### Modifying Blocking Rules

**Add new rules:**
1. Open `rules/easylist.json` or `rules/easyprivacy.json`
2. Add new rule objects following the format
3. Rebuild: `npm run build`
4. Reload extension

**Add custom filter support:**
1. Modify `background/filter-manager.js`
2. Update parsing logic
3. Test with various filter formats

## 🧪 Testing Your Changes

### Manual Testing Checklist

- [ ] Extension loads without errors
- [ ] Icon displays correctly
- [ ] Popup shows statistics
- [ ] Ads are blocked on test sites
- [ ] Whitelist functionality works
- [ ] Settings page accessible
- [ ] Custom filters can be added
- [ ] Statistics update in real-time

### Test Sites

Try these sites to verify blocking:
- news.ycombinator.com (light ads)
- cnn.com (moderate ads)
- forbes.com (heavy ads)
- reddit.com (various ad formats)

## 📦 Building for Production in Cursor

### Create Distribution Package

```bash
npm run pack
```

This creates: `releases/aisim-adblocker-v1.0.0.zip`

### Pre-Release Checklist

- [ ] All features working
- [ ] No console errors
- [ ] Icons generated
- [ ] Documentation updated
- [ ] Version number incremented in `manifest.json`
- [ ] CHANGELOG.md updated

## 🔗 Integration with Docker

You can still use Docker from Cursor's terminal:

```bash
# Build with Docker
docker-compose --profile build up aisim-adblocker-build

# Start dev container
docker-compose up
```

## 💬 Getting Help

**Within Cursor:**
1. Use Cursor AI chat (`Cmd+K / Ctrl+K`)
2. Ask specific questions about the code
3. Request debugging assistance

**External Resources:**
- Check README.md for general info
- Read INSTALLATION.md for setup details
- Review code comments for functionality
- Check GitHub issues for known problems

## 🎯 Next Steps

Now that you're set up:

1. Explore the codebase with Cursor's navigation
2. Make a small change and test the workflow
3. Familiarize yourself with the blocking logic
4. Experiment with UI modifications
5. Add your own custom features

Happy coding in Cursor! 🚀

---

For more information, see:
- [README.md](README.md) - Project overview
- [INSTALLATION.md](INSTALLATION.md) - Detailed setup
- [QUICKSTART.md](QUICKSTART.md) - Fast setup guide

# Changelog

All notable changes to AISim AdBlocker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-11-08

### Added
- Custom filter persistence and loading in options page
- Filter list toggle functionality (enable/disable EasyList and EasyPrivacy)
- Enhanced ABP filter parser with support for:
  - Exception rules (@@)
  - Filter options ($script, $image, $third-party, $domain, etc.)
  - Domain anchors (||)
  - URL anchors (|)
  - Separator characters (^)
  - Resource type filtering
  - Domain-specific rules
- GET_CUSTOM_FILTERS message handler for retrieving custom filters
- TOGGLE_FILTER_LIST message handler for enabling/disabling filter lists
- Improved filter list update mechanism with ruleset verification
- ABP filter list converter (convertABPListToRules) for future implementations

### Fixed
- Custom filters now properly load and display in options page
- Custom filter removal now works correctly with filter IDs
- Filter list toggles now properly enable/disable rulesets

### Improved
- Better error handling throughout filter management
- Enhanced filter parsing with proper option handling
- More robust custom filter storage (stores both filter text and compiled rules)
- Filter manager now validates and ensures rulesets are enabled on update

---

## [2.0.0] - 2025-10-27

### Enhanced Stability & Performance
- 🔧 **Improved Error Handling**: Comprehensive error handling with retry logic
- 🛡️ **Initialization Robustness**: Prevents multiple initialization attempts
- 🔄 **Auto-Recovery**: Automatic retry mechanisms for failed operations
- 📊 **Health Monitoring**: Built-in health check system with error counting
- ⚡ **Performance Optimization**: Reduced memory leaks and improved cleanup
- 🎯 **Message Validation**: Enhanced message validation and error responses
- 🔒 **Graceful Degradation**: Fallback states for failed initialization

### New Features
- 🏥 **Health Check API**: New HEALTH_CHECK message type for monitoring
- 🔄 **Retry Logic**: Automatic retry for failed operations (3 attempts)
- ⚠️ **Error State UI**: User-friendly error display with retry options
- 🧹 **Memory Management**: Proper cleanup of intervals and observers
- 📈 **Error Tracking**: Error count tracking and reporting
- 🔧 **Enhanced Validation**: Input validation for all message types

### Stability Improvements
- **Service Worker**: Added initialization promise to prevent race conditions
- **Content Script**: Enhanced retry logic and error handling
- **Popup Interface**: Improved error states and recovery mechanisms
- **Message Handling**: Better validation and error responses
- **Resource Cleanup**: Proper cleanup of timers and observers

### Bug Fixes
- Fixed potential memory leaks in popup refresh intervals
- Fixed race conditions in initialization
- Fixed error handling in content script
- Fixed message validation issues
- Fixed cleanup on popup close

### Performance
- Reduced initialization time with better error handling
- Improved memory usage with proper cleanup
- Enhanced stability under high load
- Better error recovery mechanisms

---

## [1.0.0] - 2025-10-27

### Added
- 🎉 Initial release of AISim AdBlocker
- 🚀 High-performance ad blocking using declarativeNetRequest API
- 🎯 Multi-layer blocking (network, DOM, JavaScript)
- 🔒 Privacy protection with tracker blocking
- 📊 Real-time statistics tracking
- 🎨 Beautiful gradient-based UI
- ⚙️ Comprehensive settings page
- 🌐 Whitelist management
- 🔧 Custom filter support
- 📦 EasyList and EasyPrivacy integration
- 🐳 Docker development environment
- 📝 Complete documentation
- ⚡ Zero page freeze guarantee
- 🎨 SVG icon with auto-generation script
- 🔄 Auto-rebuild development mode
- 📦 Production build and packaging scripts

### Features
- Block display ads, video ads, and pop-ups
- Block analytics and tracking scripts
- Block fingerprinting attempts
- Estimate bandwidth savings
- Per-page statistics
- Total lifetime statistics
- Badge notification with block count
- One-click whitelist toggle
- Filter list management
- Custom blocking rules
- Settings import/export ready
- Cross-tab statistics sync

### Performance
- Optimized for zero performance impact
- Asynchronous DOM operations
- Debounced mutation observers
- Efficient CSS selectors
- Minimal memory footprint
- No page freezing issues

### Development
- Node.js build system
- Docker containerization
- Hot reload development mode
- ESLint code linting
- Prettier code formatting
- Automated icon generation
- ZIP packaging for distribution
- Comprehensive build scripts

### Documentation
- Detailed README with features
- Step-by-step installation guide
- Quick start guide
- Development documentation
- Troubleshooting section
- Contributing guidelines
- MIT License

---

## Future Releases

### [1.1.0] - Planned
- Automated filter list updates
- More filter list options
- Statistics export
- Dark mode theme

### [1.2.0] - Planned
- Settings sync across devices
- Import/export settings
- Advanced statistics dashboard
- Performance profiling

### [2.0.0] - Planned
- Browser action context menu
- Keyboard shortcuts
- Theme customization
- Multi-language support

---

For the latest updates, check the [GitHub repository](https://github.com/yourusername/aisim-adblocker).

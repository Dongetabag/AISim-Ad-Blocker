// AISim AdBlocker - Background Service Worker
// High-performance ad blocking with declarativeNetRequest API

import { FilterManager } from './filter-manager.js';
import { StatsManager } from './stats-manager.js';
import { StorageManager } from './storage-manager.js';

class AdBlockerBackground {
  constructor() {
    this.filterManager = new FilterManager();
    this.statsManager = new StatsManager();
    this.storageManager = new StorageManager();
    this.isEnabled = true;
    this.whitelistedDomains = new Set();
    
    this.init();
  }

  async init() {
    console.log('AISim AdBlocker: Initializing...');
    
    // Load settings from storage
    await this.loadSettings();
    
    // Initialize filter lists
    await this.filterManager.initialize();
    
    // Set up listeners
    this.setupListeners();
    
    // Update filter lists on alarm
    chrome.alarms.create('updateFilters', { periodInMinutes: 1440 }); // Daily
    
    console.log('AISim AdBlocker: Ready');
  }

  async loadSettings() {
    const settings = await this.storageManager.get(['isEnabled', 'whitelistedDomains', 'customFilters']);
    this.isEnabled = settings.isEnabled !== false;
    this.whitelistedDomains = new Set(settings.whitelistedDomains || []);
    
    // Update icon based on state
    this.updateIcon();
  }

  setupListeners() {
    // Listen for web requests to track blocked items
    chrome.webRequest.onBeforeRequest.addListener(
      (details) => this.onBeforeRequest(details),
      { urls: ["<all_urls>"] },
      []
    );

    // Listen for navigation to reset page stats
    chrome.webNavigation.onCommitted.addListener(
      (details) => this.onNavigationCommitted(details)
    );

    // Listen for messages from popup/content scripts
    chrome.runtime.onMessage.addListener(
      (message, sender, sendResponse) => this.handleMessage(message, sender, sendResponse)
    );

    // Listen for alarms
    chrome.alarms.onAlarm.addListener(
      (alarm) => this.handleAlarm(alarm)
    );

    // Listen for tab updates
    chrome.tabs.onUpdated.addListener(
      (tabId, changeInfo, tab) => this.onTabUpdated(tabId, changeInfo, tab)
    );
  }

  onBeforeRequest(details) {
    // This runs for tracking purposes only
    // Actual blocking is done by declarativeNetRequest for performance
    if (!this.isEnabled) return;

    const url = new URL(details.url);
    const hostname = url.hostname;

    // Check if domain is whitelisted
    if (this.isWhitelisted(hostname)) {
      return;
    }

    // Track the request for statistics
    this.statsManager.trackRequest(details);
  }

  onNavigationCommitted(details) {
    if (details.frameId === 0) { // Main frame only
      this.statsManager.resetPageStats(details.tabId);
    }
  }

  async onTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
      const url = new URL(tab.url);
      const isWhitelisted = this.isWhitelisted(url.hostname);
      
      // Update badge
      const stats = await this.statsManager.getPageStats(tabId);
      this.updateBadge(tabId, stats.blocked, isWhitelisted);
    }
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.type) {
        case 'GET_STATS':
          const stats = await this.statsManager.getStats(message.tabId);
          sendResponse({ success: true, stats });
          break;

        case 'TOGGLE_ENABLED':
          await this.toggleEnabled();
          sendResponse({ success: true, isEnabled: this.isEnabled });
          break;

        case 'TOGGLE_WHITELIST':
          await this.toggleWhitelist(message.domain);
          sendResponse({ success: true, isWhitelisted: this.isWhitelisted(message.domain) });
          break;

        case 'ADD_CUSTOM_FILTER':
          await this.filterManager.addCustomFilter(message.filter);
          sendResponse({ success: true });
          break;

        case 'REMOVE_CUSTOM_FILTER':
          await this.filterManager.removeCustomFilter(message.filterId);
          sendResponse({ success: true });
          break;

        case 'GET_SETTINGS':
          const settings = await this.getSettings();
          sendResponse({ success: true, settings });
          break;

        case 'UPDATE_FILTERS':
          await this.filterManager.updateFilterLists();
          sendResponse({ success: true });
          break;

        case 'GET_WHITELIST':
          sendResponse({ 
            success: true, 
            whitelist: Array.from(this.whitelistedDomains) 
          });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }

    return true; // Keep message channel open for async response
  }

  handleAlarm(alarm) {
    if (alarm.name === 'updateFilters') {
      console.log('Updating filter lists...');
      this.filterManager.updateFilterLists();
    }
  }

  async toggleEnabled() {
    this.isEnabled = !this.isEnabled;
    await this.storageManager.set({ isEnabled: this.isEnabled });
    
    // Update rules
    if (this.isEnabled) {
      await this.filterManager.enableAllRules();
    } else {
      await this.filterManager.disableAllRules();
    }
    
    this.updateIcon();
  }

  async toggleWhitelist(domain) {
    if (this.whitelistedDomains.has(domain)) {
      this.whitelistedDomains.delete(domain);
    } else {
      this.whitelistedDomains.add(domain);
    }
    
    await this.storageManager.set({ 
      whitelistedDomains: Array.from(this.whitelistedDomains) 
    });
    
    // Update whitelist rules
    await this.filterManager.updateWhitelistRules(Array.from(this.whitelistedDomains));
  }

  isWhitelisted(hostname) {
    // Check exact match or parent domains
    const parts = hostname.split('.');
    for (let i = 0; i < parts.length - 1; i++) {
      const domain = parts.slice(i).join('.');
      if (this.whitelistedDomains.has(domain)) {
        return true;
      }
    }
    return false;
  }

  updateIcon() {
    const iconPath = this.isEnabled ? 'icons/icon48.png' : 'icons/icon48-disabled.png';
    chrome.action.setIcon({ path: iconPath });
  }

  updateBadge(tabId, blockedCount, isWhitelisted) {
    if (isWhitelisted) {
      chrome.action.setBadgeText({ tabId, text: '✓' });
      chrome.action.setBadgeBackgroundColor({ tabId, color: '#4CAF50' });
    } else if (blockedCount > 0) {
      chrome.action.setBadgeText({ tabId, text: blockedCount.toString() });
      chrome.action.setBadgeBackgroundColor({ tabId, color: '#F44336' });
    } else {
      chrome.action.setBadgeText({ tabId, text: '' });
    }
  }

  async getSettings() {
    return {
      isEnabled: this.isEnabled,
      whitelistedDomains: Array.from(this.whitelistedDomains),
      filterLists: await this.filterManager.getFilterListInfo(),
      stats: await this.statsManager.getTotalStats()
    };
  }
}

// Initialize the ad blocker
const adBlocker = new AdBlockerBackground();

// Make it globally accessible for debugging
globalThis.adBlocker = adBlocker;

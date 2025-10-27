// Stats Manager - Tracks blocked ads and performance statistics

export class StatsManager {
  constructor() {
    this.pageStats = new Map(); // tabId -> stats
    this.totalStats = {
      adsBlocked: 0,
      trackersBlocked: 0,
      bandwidthSaved: 0,
      pageLoadsOptimized: 0
    };
    
    this.loadTotalStats();
  }

  async loadTotalStats() {
    const data = await chrome.storage.local.get('totalStats');
    if (data.totalStats) {
      this.totalStats = data.totalStats;
    }
  }

  async saveTotalStats() {
    await chrome.storage.local.set({ totalStats: this.totalStats });
  }

  trackRequest(details) {
    const { tabId, url, type } = details;
    
    if (!this.pageStats.has(tabId)) {
      this.pageStats.set(tabId, {
        adsBlocked: 0,
        trackersBlocked: 0,
        scriptsBlocked: 0,
        imagesBlocked: 0,
        blockedUrls: [],
        bandwidthSaved: 0
      });
    }
    
    const stats = this.pageStats.get(tabId);
    
    // Categorize the request
    if (this.isAd(url)) {
      stats.adsBlocked++;
      this.totalStats.adsBlocked++;
    }
    
    if (this.isTracker(url)) {
      stats.trackersBlocked++;
      this.totalStats.trackersBlocked++;
    }
    
    if (type === 'script') {
      stats.scriptsBlocked++;
    } else if (type === 'image') {
      stats.imagesBlocked++;
    }
    
    // Estimate bandwidth saved (rough estimate)
    const estimatedSize = this.estimateResourceSize(type);
    stats.bandwidthSaved += estimatedSize;
    this.totalStats.bandwidthSaved += estimatedSize;
    
    stats.blockedUrls.push({
      url,
      type,
      timestamp: Date.now()
    });
    
    // Keep only last 100 blocked URLs per page
    if (stats.blockedUrls.length > 100) {
      stats.blockedUrls = stats.blockedUrls.slice(-100);
    }
    
    // Save total stats periodically
    if (Math.random() < 0.1) { // 10% chance to save
      this.saveTotalStats();
    }
  }

  isAd(url) {
    const adPatterns = [
      /doubleclick\.net/,
      /googlesyndication\.com/,
      /googleadservices\.com/,
      /ad[sx]?\..*\./,
      /adserver/,
      /advertisement/,
      /\/ads?\//,
      /\/adv\//,
      /banner/,
      /sponsor/,
      /tracking/,
      /analytics/
    ];
    
    return adPatterns.some(pattern => pattern.test(url));
  }

  isTracker(url) {
    const trackerPatterns = [
      /google-analytics\.com/,
      /analytics\./,
      /tracking\./,
      /tracker\./,
      /telemetry\./,
      /metrics\./,
      /pixel\./,
      /beacon\./,
      /stats\./
    ];
    
    return trackerPatterns.some(pattern => pattern.test(url));
  }

  estimateResourceSize(type) {
    // Rough estimates in bytes
    const sizes = {
      script: 50000,      // 50KB
      image: 30000,       // 30KB
      stylesheet: 20000,  // 20KB
      media: 500000,      // 500KB
      font: 100000,       // 100KB
      xmlhttprequest: 5000, // 5KB
      other: 10000        // 10KB
    };
    
    return sizes[type] || sizes.other;
  }

  resetPageStats(tabId) {
    if (this.pageStats.has(tabId)) {
      this.totalStats.pageLoadsOptimized++;
      this.pageStats.delete(tabId);
      this.saveTotalStats();
    }
  }

  async getPageStats(tabId) {
    return this.pageStats.get(tabId) || {
      adsBlocked: 0,
      trackersBlocked: 0,
      scriptsBlocked: 0,
      imagesBlocked: 0,
      blockedUrls: [],
      bandwidthSaved: 0
    };
  }

  async getStats(tabId) {
    const pageStats = await this.getPageStats(tabId);
    
    return {
      page: pageStats,
      total: this.totalStats,
      blocked: pageStats.adsBlocked + pageStats.trackersBlocked
    };
  }

  async getTotalStats() {
    return {
      ...this.totalStats,
      bandwidthSavedMB: (this.totalStats.bandwidthSaved / 1024 / 1024).toFixed(2)
    };
  }

  async resetTotalStats() {
    this.totalStats = {
      adsBlocked: 0,
      trackersBlocked: 0,
      bandwidthSaved: 0,
      pageLoadsOptimized: 0
    };
    await this.saveTotalStats();
  }
}

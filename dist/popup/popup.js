// AISim AdBlocker - Popup Interface

class AdBlockerPopup {
  constructor() {
    this.stats = null;
    this.currentTab = null;
    this.currentDomain = null;
    this.isWhitelisted = false;
    
    this.init();
  }

  async init() {
    await this.loadCurrentTab();
    await this.loadStats();
    this.render();
    this.attachEventListeners();
    
    // Auto-refresh stats every 2 seconds
    setInterval(() => this.loadStats(), 2000);
  }

  async loadCurrentTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
      this.currentTab = tabs[0];
      if (this.currentTab.url) {
        const url = new URL(this.currentTab.url);
        this.currentDomain = url.hostname;
      }
    }
  }

  async loadStats() {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_STATS',
        tabId: this.currentTab?.id
      });
      
      if (response && response.success) {
        this.stats = response.stats;
        this.updateStatsDisplay();
      }

      // Check whitelist status
      if (this.currentDomain) {
        const whitelistResponse = await chrome.runtime.sendMessage({
          type: 'GET_SETTINGS'
        });
        
        if (whitelistResponse && whitelistResponse.success) {
          const whitelist = whitelistResponse.settings.whitelistedDomains || [];
          this.isWhitelisted = whitelist.some(domain => 
            this.currentDomain === domain || this.currentDomain.endsWith('.' + domain)
          );
          this.updateWhitelistButton();
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  render() {
    const root = document.getElementById('root');
    root.innerHTML = `
      <div class="popup-container">
        <div class="header">
          <div class="logo">
            <span class="logo-icon">🛡️</span>
            <span class="logo-text">AISim AdBlocker</span>
          </div>
          <button id="toggleEnabled" class="toggle-button">
            <span class="toggle-icon">⚡</span>
          </button>
        </div>

        <div class="stats-section">
          <h3>Current Page</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value" id="adsBlocked">0</div>
              <div class="stat-label">Ads Blocked</div>
            </div>
            <div class="stat-item">
              <div class="stat-value" id="trackersBlocked">0</div>
              <div class="stat-label">Trackers Blocked</div>
            </div>
          </div>
          <div class="stat-item full-width">
            <div class="stat-value" id="bandwidthSaved">0 KB</div>
            <div class="stat-label">Bandwidth Saved</div>
          </div>
        </div>

        <div class="stats-section">
          <h3>Total Stats</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value" id="totalAds">0</div>
              <div class="stat-label">Total Ads</div>
            </div>
            <div class="stat-item">
              <div class="stat-value" id="totalTrackers">0</div>
              <div class="stat-label">Total Trackers</div>
            </div>
          </div>
          <div class="stat-item full-width">
            <div class="stat-value" id="totalBandwidth">0 MB</div>
            <div class="stat-label">Total Bandwidth Saved</div>
          </div>
        </div>

        <div class="domain-section" id="domainSection">
          <div class="domain-info">
            <span class="domain-icon">🌐</span>
            <span class="domain-name" id="domainName">-</span>
          </div>
          <button id="toggleWhitelist" class="whitelist-button">
            <span id="whitelistText">Add to Whitelist</span>
          </button>
        </div>

        <div class="actions">
          <button id="openOptions" class="action-button">
            <span>⚙️</span> Settings
          </button>
          <button id="refreshFilters" class="action-button">
            <span>🔄</span> Update Filters
          </button>
        </div>
      </div>
    `;
  }

  updateStatsDisplay() {
    if (!this.stats) return;

    // Page stats
    document.getElementById('adsBlocked').textContent = 
      this.stats.page.adsBlocked || 0;
    document.getElementById('trackersBlocked').textContent = 
      this.stats.page.trackersBlocked || 0;
    document.getElementById('bandwidthSaved').textContent = 
      this.formatBytes(this.stats.page.bandwidthSaved || 0);

    // Total stats
    document.getElementById('totalAds').textContent = 
      this.formatNumber(this.stats.total.adsBlocked || 0);
    document.getElementById('totalTrackers').textContent = 
      this.formatNumber(this.stats.total.trackersBlocked || 0);
    document.getElementById('totalBandwidth').textContent = 
      this.stats.total.bandwidthSavedMB || '0.00' + ' MB';

    // Domain
    if (this.currentDomain) {
      document.getElementById('domainName').textContent = this.currentDomain;
      document.getElementById('domainSection').style.display = 'block';
    }
  }

  updateWhitelistButton() {
    const button = document.getElementById('toggleWhitelist');
    const text = document.getElementById('whitelistText');
    
    if (this.isWhitelisted) {
      button.classList.add('whitelisted');
      text.textContent = 'Remove from Whitelist';
    } else {
      button.classList.remove('whitelisted');
      text.textContent = 'Add to Whitelist';
    }
  }

  attachEventListeners() {
    document.getElementById('toggleEnabled').addEventListener('click', 
      () => this.toggleEnabled());
    
    document.getElementById('toggleWhitelist').addEventListener('click', 
      () => this.toggleWhitelist());
    
    document.getElementById('openOptions').addEventListener('click', 
      () => this.openOptions());
    
    document.getElementById('refreshFilters').addEventListener('click', 
      () => this.refreshFilters());
  }

  async toggleEnabled() {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'TOGGLE_ENABLED'
      });
      
      if (response && response.success) {
        const button = document.getElementById('toggleEnabled');
        if (response.isEnabled) {
          button.classList.remove('disabled');
          button.title = 'Ad blocker is enabled';
        } else {
          button.classList.add('disabled');
          button.title = 'Ad blocker is disabled';
        }
      }
    } catch (error) {
      console.error('Error toggling enabled:', error);
    }
  }

  async toggleWhitelist() {
    if (!this.currentDomain) return;

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'TOGGLE_WHITELIST',
        domain: this.currentDomain
      });
      
      if (response && response.success) {
        this.isWhitelisted = response.isWhitelisted;
        this.updateWhitelistButton();
        
        // Reload the tab to apply changes
        if (this.currentTab) {
          chrome.tabs.reload(this.currentTab.id);
        }
      }
    } catch (error) {
      console.error('Error toggling whitelist:', error);
    }
  }

  openOptions() {
    chrome.runtime.openOptionsPage();
  }

  async refreshFilters() {
    const button = document.getElementById('refreshFilters');
    button.disabled = true;
    button.innerHTML = '<span>⏳</span> Updating...';
    
    try {
      await chrome.runtime.sendMessage({
        type: 'UPDATE_FILTERS'
      });
      
      button.innerHTML = '<span>✓</span> Updated!';
      setTimeout(() => {
        button.disabled = false;
        button.innerHTML = '<span>🔄</span> Update Filters';
      }, 2000);
    } catch (error) {
      console.error('Error updating filters:', error);
      button.innerHTML = '<span>✗</span> Error';
      setTimeout(() => {
        button.disabled = false;
        button.innerHTML = '<span>🔄</span> Update Filters';
      }, 2000);
    }
  }

  formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }

  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  new AdBlockerPopup();
});

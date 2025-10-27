// AISim AdBlocker - Options Page

class OptionsPage {
  constructor() {
    this.whitelist = [];
    this.customFilters = [];
    this.stats = {};
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.loadStats();
    this.attachEventListeners();
  }

  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_SETTINGS'
      });
      
      if (response && response.success) {
        this.whitelist = response.settings.whitelistedDomains || [];
        this.renderWhitelist();
      }

      const whitelistResponse = await chrome.runtime.sendMessage({
        type: 'GET_WHITELIST'
      });
      
      if (whitelistResponse && whitelistResponse.success) {
        this.whitelist = whitelistResponse.whitelist || [];
        this.renderWhitelist();
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async loadStats() {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_SETTINGS'
      });
      
      if (response && response.success && response.settings.stats) {
        this.stats = response.settings.stats;
        this.renderStats();
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  renderWhitelist() {
    const container = document.getElementById('whitelistContainer');
    
    if (this.whitelist.length === 0) {
      container.innerHTML = '<div class="empty-state">No whitelisted domains</div>';
      return;
    }

    container.innerHTML = this.whitelist.map(domain => `
      <div class="list-item" data-domain="${domain}">
        <span class="list-item-text">${domain}</span>
        <button class="remove-button" data-domain="${domain}">✕</button>
      </div>
    `).join('');

    // Attach remove listeners
    container.querySelectorAll('.remove-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const domain = e.target.getAttribute('data-domain');
        this.removeFromWhitelist(domain);
      });
    });
  }

  renderCustomFilters() {
    const container = document.getElementById('customFiltersContainer');
    
    if (this.customFilters.length === 0) {
      container.innerHTML = '<div class="empty-state">No custom filters</div>';
      return;
    }

    container.innerHTML = this.customFilters.map(filter => `
      <div class="list-item" data-filter="${filter}">
        <code class="list-item-text">${filter}</code>
        <button class="remove-button" data-filter="${filter}">✕</button>
      </div>
    `).join('');

    // Attach remove listeners
    container.querySelectorAll('.remove-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const filter = e.target.getAttribute('data-filter');
        this.removeCustomFilter(filter);
      });
    });
  }

  renderStats() {
    document.getElementById('totalAdsBlocked').textContent = 
      this.formatNumber(this.stats.adsBlocked || 0);
    document.getElementById('totalTrackersBlocked').textContent = 
      this.formatNumber(this.stats.trackersBlocked || 0);
    document.getElementById('totalBandwidthSaved').textContent = 
      this.stats.bandwidthSavedMB || '0.00' + ' MB';
    document.getElementById('totalPagesOptimized').textContent = 
      this.formatNumber(this.stats.pageLoadsOptimized || 0);
  }

  attachEventListeners() {
    // Add to whitelist
    document.getElementById('addWhitelist').addEventListener('click', 
      () => this.addToWhitelist());
    
    document.getElementById('whitelistInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addToWhitelist();
      }
    });

    // Add custom filter
    document.getElementById('addCustomFilter').addEventListener('click', 
      () => this.addCustomFilter());
    
    document.getElementById('customFilterInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addCustomFilter();
      }
    });

    // Update filters
    document.getElementById('updateFilters').addEventListener('click', 
      () => this.updateFilters());

    // Reset stats
    document.getElementById('resetStats').addEventListener('click', 
      () => this.resetStats());
  }

  async addToWhitelist() {
    const input = document.getElementById('whitelistInput');
    const domain = input.value.trim();
    
    if (!domain) {
      this.showStatus('Please enter a domain', 'error');
      return;
    }

    if (this.whitelist.includes(domain)) {
      this.showStatus('Domain already whitelisted', 'error');
      return;
    }

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'TOGGLE_WHITELIST',
        domain: domain
      });
      
      if (response && response.success) {
        this.whitelist.push(domain);
        this.renderWhitelist();
        input.value = '';
        this.showStatus('Domain added to whitelist', 'success');
      }
    } catch (error) {
      console.error('Error adding to whitelist:', error);
      this.showStatus('Error adding domain', 'error');
    }
  }

  async removeFromWhitelist(domain) {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'TOGGLE_WHITELIST',
        domain: domain
      });
      
      if (response && response.success) {
        this.whitelist = this.whitelist.filter(d => d !== domain);
        this.renderWhitelist();
        this.showStatus('Domain removed from whitelist', 'success');
      }
    } catch (error) {
      console.error('Error removing from whitelist:', error);
      this.showStatus('Error removing domain', 'error');
    }
  }

  async addCustomFilter() {
    const input = document.getElementById('customFilterInput');
    const filter = input.value.trim();
    
    if (!filter) {
      this.showStatus('Please enter a filter rule', 'error');
      return;
    }

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'ADD_CUSTOM_FILTER',
        filter: filter
      });
      
      if (response && response.success) {
        this.customFilters.push(filter);
        this.renderCustomFilters();
        input.value = '';
        this.showStatus('Custom filter added', 'success');
      }
    } catch (error) {
      console.error('Error adding custom filter:', error);
      this.showStatus('Error adding filter', 'error');
    }
  }

  async removeCustomFilter(filter) {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'REMOVE_CUSTOM_FILTER',
        filterId: filter
      });
      
      if (response && response.success) {
        this.customFilters = this.customFilters.filter(f => f !== filter);
        this.renderCustomFilters();
        this.showStatus('Custom filter removed', 'success');
      }
    } catch (error) {
      console.error('Error removing custom filter:', error);
      this.showStatus('Error removing filter', 'error');
    }
  }

  async updateFilters() {
    const button = document.getElementById('updateFilters');
    const statusDiv = document.getElementById('updateStatus');
    
    button.disabled = true;
    button.textContent = 'Updating...';
    
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'UPDATE_FILTERS'
      });
      
      if (response && response.success) {
        statusDiv.textContent = 'Filter lists updated successfully!';
        statusDiv.className = 'status-message success';
      } else {
        statusDiv.textContent = 'Error updating filter lists';
        statusDiv.className = 'status-message error';
      }
    } catch (error) {
      console.error('Error updating filters:', error);
      statusDiv.textContent = 'Error updating filter lists';
      statusDiv.className = 'status-message error';
    }
    
    setTimeout(() => {
      button.disabled = false;
      button.textContent = 'Update All Filter Lists';
      statusDiv.textContent = '';
    }, 3000);
  }

  async resetStats() {
    if (!confirm('Are you sure you want to reset all statistics?')) {
      return;
    }

    try {
      await chrome.storage.local.set({
        totalStats: {
          adsBlocked: 0,
          trackersBlocked: 0,
          bandwidthSaved: 0,
          pageLoadsOptimized: 0
        }
      });
      
      this.stats = {
        adsBlocked: 0,
        trackersBlocked: 0,
        bandwidthSaved: 0,
        pageLoadsOptimized: 0
      };
      
      this.renderStats();
      this.showStatus('Statistics reset successfully', 'success');
    } catch (error) {
      console.error('Error resetting stats:', error);
      this.showStatus('Error resetting statistics', 'error');
    }
  }

  showStatus(message, type) {
    // Create temporary status message
    const status = document.createElement('div');
    status.className = `status-toast ${type}`;
    status.textContent = message;
    document.body.appendChild(status);
    
    setTimeout(() => {
      status.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      status.classList.remove('show');
      setTimeout(() => status.remove(), 300);
    }, 3000);
  }

  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}

// Initialize options page
document.addEventListener('DOMContentLoaded', () => {
  new OptionsPage();
});

// Filter Manager - Handles filter list management and declarativeNetRequest rules

export class FilterManager {
  constructor() {
    this.filterLists = {
      easylist: {
        name: 'EasyList',
        url: 'https://easylist.to/easylist/easylist.txt',
        enabled: true,
        lastUpdate: null
      },
      easyprivacy: {
        name: 'EasyPrivacy',
        url: 'https://easylist.to/easylist/easyprivacy.txt',
        enabled: true,
        lastUpdate: null
      },
      custom: {
        name: 'Custom Filters',
        enabled: true,
        filters: []
      }
    };
  }

  async initialize() {
    console.log('FilterManager: Initializing...');
    
    // Check if filter lists need updating
    const lastUpdate = await this.getLastUpdateTime();
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    if (!lastUpdate || (now - lastUpdate) > dayInMs) {
      console.log('FilterManager: Updating filter lists...');
      await this.updateFilterLists();
    } else {
      console.log('FilterManager: Using cached filter lists');
    }
  }

  async updateFilterLists() {
    try {
      // In a real implementation, these would be downloaded and converted
      // For now, we'll use pre-generated rule sets
      console.log('FilterManager: Filter lists updated');
      
      await chrome.storage.local.set({
        lastFilterUpdate: Date.now()
      });
      
      return true;
    } catch (error) {
      console.error('FilterManager: Error updating filters:', error);
      return false;
    }
  }

  async getLastUpdateTime() {
    const data = await chrome.storage.local.get('lastFilterUpdate');
    return data.lastFilterUpdate || null;
  }

  async enableAllRules() {
    const rulesets = await chrome.declarativeNetRequest.getEnabledRulesets();
    const allRulesets = ['easylist', 'easyprivacy', 'custom', 'whitelist'];
    const toEnable = allRulesets.filter(id => !rulesets.includes(id));
    
    if (toEnable.length > 0) {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: toEnable
      });
    }
  }

  async disableAllRules() {
    const rulesets = await chrome.declarativeNetRequest.getEnabledRulesets();
    const toDisable = rulesets.filter(id => id !== 'whitelist');
    
    if (toDisable.length > 0) {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: toDisable
      });
    }
  }

  async addCustomFilter(filter) {
    // Add custom filter rule
    const rules = await this.getCustomRules();
    const newRuleId = this.generateRuleId();
    
    const newRule = this.parseFilterToRule(filter, newRuleId);
    rules.push(newRule);
    
    await this.saveCustomRules(rules);
    await this.updateDynamicRules();
  }

  async removeCustomFilter(filterId) {
    const rules = await this.getCustomRules();
    const filtered = rules.filter(rule => rule.id !== filterId);
    
    await this.saveCustomRules(filtered);
    await this.updateDynamicRules();
  }

  async getCustomRules() {
    const data = await chrome.storage.local.get('customRules');
    return data.customRules || [];
  }

  async saveCustomRules(rules) {
    await chrome.storage.local.set({ customRules: rules });
  }

  async updateDynamicRules() {
    const customRules = await this.getCustomRules();
    
    // Get current dynamic rules
    const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
    const currentIds = currentRules.map(r => r.id);
    
    // Update dynamic rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: currentIds,
      addRules: customRules
    });
  }

  async updateWhitelistRules(domains) {
    // Create allowAllRequests rules for whitelisted domains
    const whitelistRules = domains.map((domain, index) => ({
      id: 900000 + index,
      priority: 10000, // High priority to override blocking rules
      action: {
        type: 'allowAllRequests'
      },
      condition: {
        requestDomains: [domain],
        resourceTypes: [
          'main_frame',
          'sub_frame',
          'stylesheet',
          'script',
          'image',
          'font',
          'object',
          'xmlhttprequest',
          'ping',
          'csp_report',
          'media',
          'websocket',
          'webtransport',
          'webbundle',
          'other'
        ]
      }
    }));
    
    // Update session rules for whitelist
    const currentSessionRules = await chrome.declarativeNetRequest.getSessionRules();
    const whitelistRuleIds = currentSessionRules
      .filter(r => r.id >= 900000 && r.id < 1000000)
      .map(r => r.id);
    
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: whitelistRuleIds,
      addRules: whitelistRules
    });
  }

  parseFilterToRule(filter, ruleId) {
    // Simple parser for filter rules
    // In production, use a full ABP filter parser
    
    let rule = {
      id: ruleId,
      priority: 1,
      action: { type: 'block' }
    };
    
    if (filter.startsWith('||')) {
      // Domain-based rule
      const domain = filter.slice(2).split(/[\^\$\/]/)[0];
      rule.condition = {
        urlFilter: domain,
        resourceTypes: ['script', 'image', 'stylesheet', 'xmlhttprequest', 'other']
      };
    } else if (filter.includes('*')) {
      // Wildcard rule
      rule.condition = {
        urlFilter: filter.replace(/\*/g, '.*'),
        isUrlFilterCaseSensitive: false,
        resourceTypes: ['script', 'image', 'stylesheet', 'xmlhttprequest', 'other']
      };
    } else {
      // Simple substring match
      rule.condition = {
        urlFilter: filter,
        resourceTypes: ['script', 'image', 'stylesheet', 'xmlhttprequest', 'other']
      };
    }
    
    return rule;
  }

  generateRuleId() {
    return 100000 + Math.floor(Math.random() * 800000);
  }

  async getFilterListInfo() {
    const lastUpdate = await this.getLastUpdateTime();
    return {
      lists: this.filterLists,
      lastUpdate: lastUpdate ? new Date(lastUpdate).toISOString() : 'Never'
    };
  }
}

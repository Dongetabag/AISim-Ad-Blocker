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
      console.log('FilterManager: Starting filter list update...');

      // For a full implementation, uncomment and implement the following:
      // 1. Download filter lists from URLs
      // 2. Parse ABP format rules
      // 3. Convert to declarativeNetRequest format
      // 4. Update the JSON rule files

      // Example implementation outline:
      /*
      for (const [listId, listInfo] of Object.entries(this.filterLists)) {
        if (listInfo.url) {
          console.log(`Downloading ${listInfo.name}...`);
          const response = await fetch(listInfo.url);
          const filterText = await response.text();
          const rules = this.convertABPListToRules(filterText, listId);
          await this.saveRulesToFile(listId, rules);
        }
      }
      */

      // For now, verify existing rulesets are loaded
      const enabledRulesets = await chrome.declarativeNetRequest.getEnabledRulesets();
      console.log('FilterManager: Currently enabled rulesets:', enabledRulesets);

      // Ensure our rulesets are enabled
      const requiredRulesets = ['easylist', 'easyprivacy', 'custom', 'whitelist'];
      const toEnable = requiredRulesets.filter(id => !enabledRulesets.includes(id));

      if (toEnable.length > 0) {
        console.log('FilterManager: Enabling rulesets:', toEnable);
        await chrome.declarativeNetRequest.updateEnabledRulesets({
          enableRulesetIds: toEnable
        });
      }

      // Update timestamp
      const updateTime = Date.now();
      await chrome.storage.local.set({
        lastFilterUpdate: updateTime
      });

      // Update filter list info
      for (const listId in this.filterLists) {
        if (this.filterLists[listId]) {
          this.filterLists[listId].lastUpdate = updateTime;
        }
      }

      console.log('FilterManager: Filter lists updated successfully');
      return true;
    } catch (error) {
      console.error('FilterManager: Error updating filters:', error);
      return false;
    }
  }

  // Helper method for future implementation
  convertABPListToRules(filterText, listId) {
    const lines = filterText.split('\n');
    const rules = [];
    let ruleId = listId === 'easylist' ? 1 : listId === 'easyprivacy' ? 50000 : 100000;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('!') || trimmed.startsWith('[')) {
        continue; // Skip comments and metadata
      }

      const rule = this.parseFilterToRule(trimmed, ruleId);
      if (rule && rule.condition.urlFilter) {
        rules.push(rule);
        ruleId++;
      }
    }

    return rules;
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
    const filters = await this.getCustomFilters();
    const newRuleId = this.generateRuleId();

    const newRule = this.parseFilterToRule(filter, newRuleId);
    newRule.filterText = filter; // Store original filter text
    rules.push(newRule);

    // Also store the filter text separately for UI display
    filters.push({ id: newRuleId, filter: filter });

    await this.saveCustomRules(rules);
    await this.saveCustomFilters(filters);
    await this.updateDynamicRules();
  }

  async removeCustomFilter(filterId) {
    const rules = await this.getCustomRules();
    const filters = await this.getCustomFilters();

    const filteredRules = rules.filter(rule => rule.id !== parseInt(filterId));
    const filteredFilters = filters.filter(f => f.id !== parseInt(filterId));

    await this.saveCustomRules(filteredRules);
    await this.saveCustomFilters(filteredFilters);
    await this.updateDynamicRules();
  }

  async getCustomRules() {
    const data = await chrome.storage.local.get('customRules');
    return data.customRules || [];
  }

  async saveCustomRules(rules) {
    await chrome.storage.local.set({ customRules: rules });
  }

  async getCustomFilters() {
    const data = await chrome.storage.local.get('customFilters');
    return data.customFilters || [];
  }

  async saveCustomFilters(filters) {
    await chrome.storage.local.set({ customFilters: filters });
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
    // Enhanced ABP filter parser
    // Skip comments and empty lines
    if (!filter || filter.startsWith('!') || filter.startsWith('[')) {
      return null;
    }

    let rule = {
      id: ruleId,
      priority: 1,
      action: { type: 'block' },
      condition: {}
    };

    // Element hiding rules (##) - not supported in declarativeNetRequest
    // These would need to be handled by content scripts
    if (filter.includes('##') || filter.includes('#@#')) {
      console.warn('Element hiding rules not supported:', filter);
      return null;
    }

    // Exception rules (@@)
    let isException = false;
    let workingFilter = filter;
    if (filter.startsWith('@@')) {
      isException = true;
      workingFilter = filter.substring(2);
      rule.action = { type: 'allow' };
      rule.priority = 2; // Higher priority for exceptions
    }

    // Extract options ($)
    let options = {};
    const optionsIndex = workingFilter.indexOf('$');
    if (optionsIndex !== -1) {
      const optionsStr = workingFilter.substring(optionsIndex + 1);
      workingFilter = workingFilter.substring(0, optionsIndex);
      options = this.parseFilterOptions(optionsStr);
    }

    // Build URL filter
    let urlFilter = workingFilter;

    // Handle domain anchor (||)
    if (urlFilter.startsWith('||')) {
      urlFilter = urlFilter.substring(2);
      // Extract domain
      const domain = urlFilter.split('/')[0].replace(/\^/g, '');
      rule.condition.requestDomains = [domain];
      // Get the path part if any
      const pathIndex = urlFilter.indexOf('/');
      if (pathIndex !== -1) {
        urlFilter = urlFilter.substring(pathIndex);
      } else {
        urlFilter = '';
      }
    }

    // Handle start anchor (|)
    if (urlFilter.startsWith('|')) {
      urlFilter = urlFilter.substring(1);
      // URL must start with this pattern
    }

    // Handle end anchor (|)
    if (urlFilter.endsWith('|')) {
      urlFilter = urlFilter.substring(0, urlFilter.length - 1);
      // URL must end with this pattern
    }

    // Handle separator (^)
    urlFilter = urlFilter.replace(/\^/g, '');

    // Handle wildcards (*)
    if (urlFilter.includes('*')) {
      rule.condition.isUrlFilterCaseSensitive = false;
    }

    // Set the URL filter if we have one
    if (urlFilter) {
      rule.condition.urlFilter = urlFilter;
    }

    // Apply options
    if (options.resourceTypes && options.resourceTypes.length > 0) {
      rule.condition.resourceTypes = options.resourceTypes;
    } else if (!rule.condition.resourceTypes) {
      // Default resource types
      rule.condition.resourceTypes = [
        'script',
        'image',
        'stylesheet',
        'xmlhttprequest',
        'sub_frame',
        'other'
      ];
    }

    if (options.domainConditions) {
      if (options.domainConditions.include) {
        rule.condition.initiatorDomains = options.domainConditions.include;
      }
      if (options.domainConditions.exclude) {
        rule.condition.excludedInitiatorDomains = options.domainConditions.exclude;
      }
    }

    if (options.thirdParty !== undefined) {
      rule.condition.domainType = options.thirdParty ? 'thirdParty' : 'firstParty';
    }

    return rule;
  }

  parseFilterOptions(optionsStr) {
    const options = {};
    const parts = optionsStr.split(',');

    const resourceTypeMap = {
      'script': 'script',
      'image': 'image',
      'stylesheet': 'stylesheet',
      'object': 'object',
      'xmlhttprequest': 'xmlhttprequest',
      'subdocument': 'sub_frame',
      'ping': 'ping',
      'websocket': 'websocket',
      'media': 'media',
      'font': 'font',
      'other': 'other'
    };

    options.resourceTypes = [];
    const excludedTypes = [];

    parts.forEach(part => {
      part = part.trim();

      // Handle negation
      const isNegated = part.startsWith('~');
      const optionName = isNegated ? part.substring(1) : part;

      // Resource types
      if (resourceTypeMap[optionName]) {
        if (isNegated) {
          excludedTypes.push(resourceTypeMap[optionName]);
        } else {
          options.resourceTypes.push(resourceTypeMap[optionName]);
        }
      }

      // Third-party
      if (optionName === 'third-party') {
        options.thirdParty = !isNegated;
      }

      // Domain option
      if (optionName.startsWith('domain=')) {
        const domains = optionName.substring(7).split('|');
        options.domainConditions = { include: [], exclude: [] };
        domains.forEach(domain => {
          if (domain.startsWith('~')) {
            options.domainConditions.exclude.push(domain.substring(1));
          } else {
            options.domainConditions.include.push(domain);
          }
        });
      }
    });

    // If no specific types were specified, use all types except excluded
    if (options.resourceTypes.length === 0 && excludedTypes.length > 0) {
      options.resourceTypes = Object.values(resourceTypeMap).filter(
        type => !excludedTypes.includes(type)
      );
    }

    return options;
  }

  generateRuleId() {
    return 100000 + Math.floor(Math.random() * 800000);
  }

  async toggleFilterList(listId, enabled) {
    try {
      if (enabled) {
        await chrome.declarativeNetRequest.updateEnabledRulesets({
          enableRulesetIds: [listId]
        });
      } else {
        await chrome.declarativeNetRequest.updateEnabledRulesets({
          disableRulesetIds: [listId]
        });
      }

      // Update filter list state
      if (this.filterLists[listId]) {
        this.filterLists[listId].enabled = enabled;
      }

      // Save state to storage
      await chrome.storage.local.set({
        [`filterList_${listId}`]: enabled
      });

      return true;
    } catch (error) {
      console.error(`Error toggling filter list ${listId}:`, error);
      return false;
    }
  }

  async getFilterListInfo() {
    const lastUpdate = await this.getLastUpdateTime();
    return {
      lists: this.filterLists,
      lastUpdate: lastUpdate ? new Date(lastUpdate).toISOString() : 'Never'
    };
  }
}

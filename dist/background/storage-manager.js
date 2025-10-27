// Storage Manager - Handles chrome.storage operations

export class StorageManager {
  constructor() {
    this.cache = new Map();
  }

  async get(keys) {
    // Try cache first
    if (typeof keys === 'string') {
      keys = [keys];
    }
    
    const cachedResults = {};
    const missingKeys = [];
    
    for (const key of keys) {
      if (this.cache.has(key)) {
        cachedResults[key] = this.cache.get(key);
      } else {
        missingKeys.push(key);
      }
    }
    
    // Fetch missing keys from storage
    if (missingKeys.length > 0) {
      const storageResults = await chrome.storage.local.get(missingKeys);
      
      // Update cache
      for (const [key, value] of Object.entries(storageResults)) {
        this.cache.set(key, value);
      }
      
      return { ...cachedResults, ...storageResults };
    }
    
    return cachedResults;
  }

  async set(items) {
    // Update cache
    for (const [key, value] of Object.entries(items)) {
      this.cache.set(key, value);
    }
    
    // Save to storage
    await chrome.storage.local.set(items);
  }

  async remove(keys) {
    if (typeof keys === 'string') {
      keys = [keys];
    }
    
    // Remove from cache
    for (const key of keys) {
      this.cache.delete(key);
    }
    
    // Remove from storage
    await chrome.storage.local.remove(keys);
  }

  async clear() {
    this.cache.clear();
    await chrome.storage.local.clear();
  }

  invalidateCache(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

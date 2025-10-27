// AISim AdBlocker v2.0.0 - Content Script
// DOM-level ad blocking for elements that bypass network blocking
// Enhanced stability and performance

(function() {
  'use strict';

  class ContentBlocker {
    constructor() {
      this.blockedElements = new Set();
      this.observer = null;
      this.isEnabled = true;
      this.scanTimeout = null;
      this.retryCount = 0;
      this.maxRetries = 3;
      this.isInitialized = false;
      
      // Common ad selectors
      this.adSelectors = [
        // Generic ad classes
        '[class*="advertisement"]',
        '[class*="ad-banner"]',
        '[class*="ad-container"]',
        '[class*="ad-wrapper"]',
        '[id*="advertisement"]',
        '[id*="ad-banner"]',
        '[id*="google_ads"]',
        '[id*="sponsored"]',
        
        // Specific ad networks
        '.adsbygoogle',
        'ins.adsbygoogle',
        'div[data-ad-slot]',
        'div[data-ad-client]',
        
        // Social media embeds (optional)
        'iframe[src*="facebook.com/plugins"]',
        'iframe[src*="twitter.com/widgets"]',
        
        // Video ads
        'div[class*="video-ad"]',
        'div[id*="video-ad"]',
        
        // Popup/overlay ads
        'div[class*="popup-ad"]',
        'div[class*="overlay-ad"]',
        'div[id*="popup"]',
        
        // Newsletter/subscription popups
        'div[class*="newsletter-popup"]',
        'div[class*="subscribe-popup"]'
      ];
      
      this.init();
    }

    async init() {
      if (this.isInitialized) {
        return;
      }

      try {
        // Check if enabled with retry logic
        const response = await this.getSettingsWithRetry();
        
        if (response && response.settings) {
          this.isEnabled = response.settings.isEnabled;
        }

        if (!this.isEnabled) {
          console.log('AISim AdBlocker: Content script disabled');
          return;
        }

        // Initial scan with error handling
        this.scanAndBlock();
        
        // Set up mutation observer for dynamic content
        this.setupObserver();
        
        // Inject additional blocking script
        this.injectBlockingScript();
        
        this.isInitialized = true;
        console.log('AISim AdBlocker v2.0.0: Content script initialized');
      } catch (error) {
        console.error('AISim AdBlocker: Content script initialization failed:', error);
        this.retryCount++;
        
        if (this.retryCount < this.maxRetries) {
          setTimeout(() => {
            this.init();
          }, 1000 * this.retryCount);
        }
      }
    }

    async getSettingsWithRetry(maxRetries = 3) {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await chrome.runtime.sendMessage({ 
            type: 'GET_SETTINGS' 
          });
        } catch (error) {
          if (i === maxRetries - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
        }
      }
    }

    scanAndBlock() {
      const startTime = performance.now();
      let blockedCount = 0;

      // Block by selectors
      this.adSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            if (!this.blockedElements.has(el)) {
              this.blockElement(el);
              blockedCount++;
            }
          });
        } catch (e) {
          // Invalid selector, skip
        }
      });

      // Block iframes with ad-related content
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (this.isAdFrame(iframe)) {
          if (!this.blockedElements.has(iframe)) {
            this.blockElement(iframe);
            blockedCount++;
          }
        }
      });

      const endTime = performance.now();
      
      if (blockedCount > 0) {
        console.log(`AISim AdBlocker: Blocked ${blockedCount} elements in ${(endTime - startTime).toFixed(2)}ms`);
      }
    }

    blockElement(element) {
      // Store original display for potential unblocking
      const originalDisplay = element.style.display;
      
      // Hide the element
      element.style.setProperty('display', 'none', 'important');
      element.style.setProperty('visibility', 'hidden', 'important');
      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('position', 'absolute', 'important');
      element.style.setProperty('left', '-9999px', 'important');
      
      // Mark as blocked
      element.setAttribute('data-aisim-blocked', 'true');
      this.blockedElements.add(element);
      
      // Collapse the space
      if (element.parentElement) {
        element.parentElement.style.setProperty('min-height', '0', 'important');
      }
    }

    isAdFrame(iframe) {
      const src = iframe.src || '';
      const id = iframe.id || '';
      const className = iframe.className || '';
      
      const adPatterns = [
        /doubleclick\.net/,
        /googlesyndication\.com/,
        /googleadservices\.com/,
        /ad\..*\//,
        /ads?\./,
        /adserver/,
        /advertisement/,
        /banner/,
        /sponsor/
      ];
      
      return adPatterns.some(pattern => 
        pattern.test(src) || pattern.test(id) || pattern.test(className)
      );
    }

    setupObserver() {
      // Watch for dynamically added content
      this.observer = new MutationObserver((mutations) => {
        let shouldScan = false;
        
        for (const mutation of mutations) {
          if (mutation.addedNodes.length > 0) {
            shouldScan = true;
            break;
          }
        }
        
        if (shouldScan) {
          // Debounce scanning
          clearTimeout(this.scanTimeout);
          this.scanTimeout = setTimeout(() => {
            this.scanAndBlock();
          }, 100);
        }
      });

      this.observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }

    injectBlockingScript() {
      // Inject a script that runs in the page context
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('content/injected.js');
      script.onload = function() {
        this.remove();
      };
      (document.head || document.documentElement).appendChild(script);
    }

    destroy() {
      if (this.observer) {
        this.observer.disconnect();
      }
      
      clearTimeout(this.scanTimeout);
    }
  }

  // Initialize content blocker
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new ContentBlocker();
    });
  } else {
    new ContentBlocker();
  }
})();

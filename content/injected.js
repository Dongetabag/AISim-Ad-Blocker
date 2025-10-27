// AISim AdBlocker - Injected Script
// Runs in page context to block ads at JavaScript level

(function() {
  'use strict';

  // Block common ad-related JavaScript APIs
  
  // Override setTimeout/setInterval to block ad-related calls
  const originalSetTimeout = window.setTimeout;
  const originalSetInterval = window.setInterval;
  
  const adKeywords = ['ad', 'ads', 'advertisement', 'banner', 'sponsor', 'tracking', 'analytics'];
  
  function containsAdKeyword(fn) {
    if (typeof fn === 'function') {
      const fnString = fn.toString();
      return adKeywords.some(keyword => fnString.toLowerCase().includes(keyword));
    }
    return false;
  }
  
  window.setTimeout = function(fn, delay, ...args) {
    if (containsAdKeyword(fn)) {
      console.log('AISim AdBlocker: Blocked setTimeout with ad-related content');
      return -1;
    }
    return originalSetTimeout.call(this, fn, delay, ...args);
  };
  
  window.setInterval = function(fn, delay, ...args) {
    if (containsAdKeyword(fn)) {
      console.log('AISim AdBlocker: Blocked setInterval with ad-related content');
      return -1;
    }
    return originalSetInterval.call(this, fn, delay, ...args);
  };
  
  // Block Google AdSense
  window.adsbygoogle = window.adsbygoogle || [];
  Object.defineProperty(window, 'adsbygoogle', {
    get: function() {
      return [];
    },
    set: function() {
      console.log('AISim AdBlocker: Blocked adsbygoogle');
    }
  });
  
  // Block common ad networks
  const blockedProperties = [
    'ga', 'gtag', 'dataLayer', 
    '_gaq', '_gat', 'GoogleAnalyticsObject',
    'fbq', '_fbq', 'gtm'
  ];
  
  blockedProperties.forEach(prop => {
    Object.defineProperty(window, prop, {
      get: function() {
        return function() {
          console.log(`AISim AdBlocker: Blocked ${prop}`);
        };
      },
      set: function() {
        console.log(`AISim AdBlocker: Blocked ${prop} setter`);
      }
    });
  });
  
  // Intercept createElement to block ad-related scripts
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    
    if (tagName.toLowerCase() === 'script' || tagName.toLowerCase() === 'iframe') {
      const originalSetAttribute = element.setAttribute;
      
      element.setAttribute = function(name, value) {
        if (name === 'src' && typeof value === 'string') {
          const adPatterns = [
            /doubleclick\.net/,
            /googlesyndication\.com/,
            /googleadservices\.com/,
            /google-analytics\.com/,
            /\/ads?\//,
            /\/adv\//
          ];
          
          if (adPatterns.some(pattern => pattern.test(value))) {
            console.log('AISim AdBlocker: Blocked script/iframe:', value);
            return;
          }
        }
        
        return originalSetAttribute.call(this, name, value);
      };
    }
    
    return element;
  };
  
  // Override fetch and XMLHttpRequest for tracking prevention
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string') {
      const trackingPatterns = [
        /analytics/,
        /tracking/,
        /telemetry/,
        /beacon/,
        /pixel/
      ];
      
      if (trackingPatterns.some(pattern => pattern.test(url))) {
        console.log('AISim AdBlocker: Blocked fetch to:', url);
        return Promise.reject(new Error('Blocked by AISim AdBlocker'));
      }
    }
    return originalFetch.apply(this, args);
  };
  
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if (typeof url === 'string') {
      const trackingPatterns = [
        /analytics/,
        /tracking/,
        /telemetry/,
        /beacon/,
        /pixel/
      ];
      
      if (trackingPatterns.some(pattern => pattern.test(url))) {
        console.log('AISim AdBlocker: Blocked XHR to:', url);
        return;
      }
    }
    return originalOpen.call(this, method, url, ...rest);
  };
  
  console.log('AISim AdBlocker: Injected script loaded');
})();

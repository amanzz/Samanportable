module.exports = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance'],
    formFactor: 'desktop',
    screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false },
    throttlingMethod: 'devtools',
    throttling: { rttMs: 40, throughputKbps: 10240, requestLatencyMs: 40, downloadThroughputKbps: 10240, uploadThroughputKbps: 10240, cpuSlowdownMultiplier: 1 },
    blockedUrlPatterns: ['*://www.googletagmanager.com/*', '*://www.google-analytics.com/*', '*://googleads.g.doubleclick.net/*', '*://connect.facebook.net/*']
  }
};

module.exports = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance'],
    formFactor: 'mobile',
    screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false },
    throttlingMethod: 'devtools',
    throttling: { rttMs: 150, throughputKbps: 1638.4, requestLatencyMs: 562.5, downloadThroughputKbps: 1474.56, uploadThroughputKbps: 675, cpuSlowdownMultiplier: 4 },
    blockedUrlPatterns: ['*://www.googletagmanager.com/*', '*://www.google-analytics.com/*', '*://googleads.g.doubleclick.net/*', '*://connect.facebook.net/*']
  }
};

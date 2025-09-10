const fs = require('fs');
const path = require('path');

// Create a simple HTML to PNG conversion setup
// This is a placeholder - in production you'd use puppeteer or similar
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #0A3D2A 0%, #1a5f3a 100%);
      font-family: 'Arial', sans-serif;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 80px;
      box-sizing: border-box;
    }
    .logo {
      display: flex;
      align-items: center;
      margin-bottom: 40px;
    }
    .logo-icon {
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
    }
    .logo-inner {
      width: 40px;
      height: 40px;
      background: #0A3D2A;
      border-radius: 6px;
    }
    .company-name {
      font-size: 32px;
      font-weight: bold;
    }
    .company-sub {
      font-size: 24px;
      color: #90EE90;
      font-weight: 600;
    }
    .main-title {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 20px;
      max-width: 800px;
    }
    .subtitle {
      font-size: 24px;
      opacity: 0.9;
      margin-bottom: 40px;
    }
    .features {
      list-style: none;
      padding: 0;
    }
    .features li {
      font-size: 20px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    .features li::before {
      content: '•';
      color: #90EE90;
      font-size: 24px;
      margin-right: 15px;
    }
    .website {
      font-size: 18px;
      opacity: 0.8;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="logo">
    <div class="logo-icon">
      <div class="logo-inner"></div>
    </div>
    <div>
      <div class="company-name">SAMAN</div>
      <div class="company-sub">PORTABLE</div>
    </div>
  </div>
  
  <h1 class="main-title">Premium Portable Office Solutions</h1>
  <p class="subtitle">Durable • Modular • Maintenance-Free</p>
  
  <ul class="features">
    <li>Porta Cabins & Container Offices</li>
    <li>Fast Installation & Delivery</li>
    <li>Customizable & Weather Resistant</li>
  </ul>
  
  <div class="website">www.samanportable.com</div>
</body>
</html>
`;

// Write the HTML file that can be used to generate the image
fs.writeFileSync(path.join(__dirname, '../public/og-template.html'), htmlContent);

console.log('OG image template created at public/og-template.html');
console.log('To generate JPG: Use a tool like puppeteer or visit the HTML file and take a screenshot');

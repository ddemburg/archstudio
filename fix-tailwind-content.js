const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'tailwind.config.js');
let content = fs.readFileSync(configPath, 'utf8');

// Replace content array to include index.html at root
content = content.replace(
  /content:\s*\[[\s\S]*?\],/,
  `content: [
    './index.html',
    './src/**/*.{html,js,jsx,ts,tsx}',
    './public/index.html',
  ],`
);

fs.writeFileSync(configPath, content, 'utf8');
console.log('✅ tailwind.config.js updated successfully');

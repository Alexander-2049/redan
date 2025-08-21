const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

// commit count
let commitCount = 'dev';
try {
  commitCount = execSync('git rev-list --count HEAD').toString().trim();
} catch {
  console.warn('⚠️ Could not get commit count (not a git repo?)');
}

// date as YYYY-MM-DD
const date = new Date();
const buildDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

// final build string
const buildVersion = `${pkg.version}.${commitCount} (${buildDate})`;

const meta = {
  version: pkg.version,
  commitCount,
  buildDate,
  buildVersion,
};

fs.writeFileSync(path.join(__dirname, '..', 'build-meta.json'), JSON.stringify(meta, null, 2));

console.log('✅ Generated build-meta.json:', buildVersion);

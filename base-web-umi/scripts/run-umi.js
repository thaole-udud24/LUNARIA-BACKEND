const { spawnSync } = require('child_process');
const path = require('path');

const umiBin = path.join(__dirname, '../node_modules/umi/bin/umi.js');
const args = process.argv.slice(2);
const nodeMajor = Number(process.versions.node.split('.')[0]);

// Node 17+: webpack 5 cũ (Umi 3) cần legacy OpenSSL provider
const nodeArgs = nodeMajor >= 17 ? ['--openssl-legacy-provider'] : [];

const result = spawnSync(
  process.execPath,
  [...nodeArgs, umiBin, ...args],
  { stdio: 'inherit', env: process.env },
);

process.exit(result.status ?? 1);

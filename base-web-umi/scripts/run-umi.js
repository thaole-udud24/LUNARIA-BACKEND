const { spawnSync } = require('child_process');
const path = require('path');

const umiBin = path.join(__dirname, '../node_modules/umi/bin/umi.js');
const args = process.argv.slice(2);
const nodeMajor = Number(process.versions.node.split('.')[0]);

// Node 17–21: webpack 5 cũ cần legacy OpenSSL; Node 16 không hỗ trợ flag này
const nodeArgs =
  nodeMajor >= 17 && nodeMajor <= 21 ? ['--openssl-legacy-provider'] : [];

const result = spawnSync(
  process.execPath,
  [...nodeArgs, umiBin, ...args],
  { stdio: 'inherit', env: process.env },
);

process.exit(result.status ?? 1);

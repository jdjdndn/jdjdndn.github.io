// Windows 跨平台：复制 shared.css 到 dist（替代 Unix cp）
const fs = require('fs');
const path = require('path');
fs.copyFileSync(path.resolve('src/shared.css'), path.resolve('dist/shared.css'));
console.log('✅ shared.css 已复制到 dist');

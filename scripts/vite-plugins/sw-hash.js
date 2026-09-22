// Service Worker 版本自动化：构建后用时间戳 hash 替换 CACHE_NAME，
// 避免手动 bump 版本号导致用户长期使用旧缓存
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { ROOT } from './shared.js';

export default function swHashPlugin() {
  return {
    name: 'sw-hash',
    writeBundle() {
      const swPath = resolve(ROOT, 'dist/sw.js');
      let sw;
      try { sw = readFileSync(swPath, 'utf-8'); }
      catch { return; } // 无 sw.js 时跳过
      const stamp = Date.now().toString(36);
      const updated = sw.replace(/const CACHE_NAME\s*=\s*'[^']*'/, `const CACHE_NAME = 'coupon-v${stamp}'`);
      if (updated !== sw) {
        writeFileSync(swPath, updated, 'utf-8');
        console.log(`✅ sw.js CACHE_NAME 已更新（v${stamp}）`);
      }
    },
  };
}

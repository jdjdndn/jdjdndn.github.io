// ============================================================
//  过期检测脚本
//  扫描 src/data.js 中所有优惠条目，输出已过期和即将过期的活动
//  用法: node scripts/check-expired.cjs [--json]
// ============================================================

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../src/data.js');
const EXPIRING_SOON_DAYS = 7;

// 解析 deadline: 'YYYY.M.D' 或 'YYYY.MM.DD' 等格式
function parseDeadline(str) {
  if (!str) return null;
  const parts = str.trim().split('.');
  if (parts.length < 3) return null;
  const [y, m, d] = parts.map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

// 从 data.js 提取所有 items（文本解析，避免 ES module 导入问题）
function extractItems(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const items = [];
  let currentTab = '';
  let currentSection = '';

  for (const line of content.split('\n')) {
    // 匹配 tab 名称
    const tabMatch = line.match(/label:\s*['"][^']*\s+(\S+)['"]/);
    if (tabMatch) currentTab = tabMatch[1];

    // 匹配 section 标题
    const secMatch = line.match(/title:\s*['"](.+?)['"]/);
    if (secMatch) currentSection = secMatch[1];

    // 匹配 item（含 name 和 deadline）
    const nameMatch = line.match(/name:\s*['"](.+?)['"]/);
    const deadlineMatch = line.match(/deadline:\s*['"](.+?)['"]/);

    if (nameMatch && deadlineMatch) {
      items.push({
        name: nameMatch[1],
        tab: currentTab,
        section: currentSection,
        deadline: deadlineMatch[1],
        deadlineDate: parseDeadline(deadlineMatch[1]),
      });
    }
  }
  return items;
}

function main() {
  const jsonMode = process.argv.includes('--json');
  const items = extractItems(DATA_FILE);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const expired = [];
  const expiringSoon = [];
  const valid = [];

  for (const item of items) {
    if (!item.deadlineDate) {
      valid.push(item);
      continue;
    }
    const diff = item.deadlineDate - now;
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      expired.push({ ...item, daysLeft });
    } else if (daysLeft <= EXPIRING_SOON_DAYS) {
      expiringSoon.push({ ...item, daysLeft });
    } else {
      valid.push(item);
    }
  }

  if (jsonMode) {
    console.log(JSON.stringify({
      total: items.length,
      expiredCount: expired.length,
      expiringSoonCount: expiringSoon.length,
      validCount: valid.length,
      expired,
      expiringSoon,
    }, null, 2));
    return;
  }

  // 文本报告
  console.log('=== 优惠过期检测报告 ===');
  console.log(`检测时间: ${now.toISOString().slice(0, 10)}`);
  console.log(`总计: ${items.length} 条 | 已过期: ${expired.length} | ${EXPIRING_SOON_DAYS}天内过期: ${expiringSoon.length} | 正常: ${valid.length}`);
  console.log('');

  if (expired.length > 0) {
    console.log(`🔴 已过期 (${expired.length})`);
    console.log('-'.repeat(60));
    for (const item of expired) {
      console.log(`  [${item.tab}] ${item.name} — 截止: ${item.deadline} (${Math.abs(item.daysLeft)}天前)`);
    }
    console.log('');
  }

  if (expiringSoon.length > 0) {
    console.log(`🟡 即将过期 (${expiringSoon.length})`);
    console.log('-'.repeat(60));
    for (const item of expiringSoon) {
      console.log(`  [${item.tab}] ${item.name} — 截止: ${item.deadline} (${item.daysLeft}天后)`);
    }
    console.log('');
  }

  if (expired.length === 0 && expiringSoon.length === 0) {
    console.log('✅ 所有活动均在有效期内');
  }

  // 退出码：有过期活动则返回1，方便 CI 判断
  if (expired.length > 0) {
    process.exit(1);
  }
}

main();

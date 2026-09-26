// 一次性清理：删除违规号卡/随身WiFi代理文章，并清理相关攻略区的引用链接
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const ARTICLE_DIR = path.join(ROOT, 'src/article');

// 待删除的代理文章（不含扩展名）
const AGENT_FILES = [
  '172-haoka-agent',
  'dandan-haoka-agent',
  'dianxin-xingka-agent',
  'haoka-agent-guide',
  'haoka-xinyao-agent',
  'kaka-tongxin-agent',
  'lingqu-haoka-agent',
  'qinghe-haoka-agent',
  'wifi-agent-faq',
  'wifi-agent-guide',
  'wifi-agent-promote',
  'wifi-agent-register',
  'creditcard-agent-guide',
  'express-agent-guide',
];

// 相关攻略区需清除的链接（含路由页 haoka-agent.html）
const LINK_PATTERN = new RegExp(
  `<a\\s+href="[^"]*?(?:${AGENT_FILES.join('|')}|haoka-agent)\\.html"[^>]*>[\\s\\S]*?</a>`,
  'g'
);

function collectHtml(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) files.push(...collectHtml(full));
    else if (name.endsWith('.html')) files.push(full);
  }
  return files;
}

let removedLinks = 0;
let removedFiles = 0;

// 1. 清理引用链接
for (const file of collectHtml(ARTICLE_DIR)) {
  const base = path.basename(file);
  if (AGENT_FILES.some((n) => `${n}.html` === base)) continue; // 自身不处理
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  html = html.replace(LINK_PATTERN, '');
  if (html !== before) {
    // 顺带清理可能出现的多余空行（链接独立成行时）
    html = html.replace(/\n\s*\n\s*\n/g, '\n\n');
    fs.writeFileSync(file, html, 'utf8');
    const n = (before.match(LINK_PATTERN) || []).length;
    removedLinks += n;
    console.log(`🧹 ${path.relative(ROOT, file)}: 删除 ${n} 个链接`);
  }
}

// 2. 删除代理文章文件
for (const name of AGENT_FILES) {
  const full = path.join(ARTICLE_DIR, `${name}.html`);
  if (fs.existsSync(full)) {
    fs.unlinkSync(full);
    removedFiles++;
    console.log(`🗑️ 删除 ${name}.html`);
  }
}

console.log(`\n✅ 完成：清理链接 ${removedLinks} 个，删除文件 ${removedFiles} 个`);

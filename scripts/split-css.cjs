#!/usr/bin/env node
/**
 * 拆分 style.css → shared.css（所有页面共享）+ index.css（首页专属）
 * 按注释段落边界分割，保留完整的媒体查询和暗色模式
 */
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../src/style.css');
const src = fs.readFileSync(SRC, 'utf-8');
const lines = src.split('\n');

// ========== 按注释段落切分 ==========
const sections = [];
let current = { start: 0, name: 'preamble', lines: [] };

for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^\/\*\s*={3,}\s*(.+?)\s*={3,}\s*\*\//);
  if (m && current.lines.length > 0) {
    sections.push(current);
    current = { start: i, name: m[1], lines: [] };
  }
  current.lines.push(lines[i]);
}
sections.push(current);

// ========== 判断每段归属 ==========
// index 专属选择器关键词
const INDEX_KEYWORDS = [
  'index-hero', '搜索栏', '快捷入口', 'Tab 导航', 'Tab 内容',
  '子分类', '子Tab', '活动卡片网格', '活动卡片', 'Toast',
  '二维码弹窗', '回到顶部', '已访问标记', '友情链接',
  '搜索高亮', '过期状态', '空状态', '预渲染',
  '分享面板', '底部导航栏', '精选活动', 'API 活动',
  '卡片封面', '骨架屏', '错误状态', '页面过渡', '时间戳',
  '首次访问引导', '反馈入口', 'Tab 内容淡入', '卡片交错',
  '网络状态', '搜索历史', '快捷键面板', '图片占位',
  '搜索结果序号', '数据新鲜度', '分享面板拖拽', '页面加载进度',
  '信任徽章', '使用人数', '卡片徽章', '卡片截止',
  '精细化骨架屏', 'Footer 版本', '快捷键提示 kbd',
  '暗色模式精细',
];

// shared 专属关键词
const SHARED_KEYWORDS = [
  '基础变量', '暗色模式全局过渡', '焦点样式', '选中文本',
  '平滑滚动', '全局链接', '图片加载过渡', '布局',
  '页面 Hero 公共', '减少动画', '焦点环', '卡片内容排版',
  '按钮内联图标', '页面底部安全', '微交互', '专业排版',
  '卡片头部对齐', '搜索历史项', 'iOS Safari', '打印',
  'Hero — 首页', 'Hero 基类', 'Hero Logo', '返回链接',
  'Hero 底部弧线',
];

// 媒体查询/暗色模式段落：检查内部选择器
function hasIndexSelectors(text) {
  return INDEX_KEYWORDS.some(kw => text.includes(kw));
}

function hasOnlySharedSelectors(text) {
  return SHARED_KEYWORDS.some(kw => text.includes(kw)) && !hasIndexSelectors(text);
}

const sharedSections = [];
const indexSections = [];

for (const sec of sections) {
  const text = sec.lines.join('\n');
  const isMediaQuery = text.includes('@media');
  const isDarkMode = text.includes('dark-mode') && !text.includes('暗色模式精细');

  // 基础变量、全局重置 → shared
  if (sec.name === 'preamble' || hasOnlySharedSelectors(text)) {
    sharedSections.push(sec);
    continue;
  }

  // 明确的 index 专属段 → index
  if (hasIndexSelectors(text)) {
    indexSections.push(sec);
    continue;
  }

  // 媒体查询/暗色模式：如果包含 index 选择器 → 拆分
  if (isMediaQuery || isDarkMode) {
    if (hasIndexSelectors(text)) {
      // 暗色模式/媒体查询同时包含 shared 和 index 选择器
      // 保留 shared 版本（变量覆盖等），index 版本也保留
      sharedSections.push(sec); // 变量覆盖等 shared 部分
      indexSections.push(sec);  // index 选择器部分
    } else {
      sharedSections.push(sec);
    }
    continue;
  }

  // 默认归 shared（安全策略）
  sharedSections.push(sec);
}

// ========== 输出 ==========
const sharedCSS = sharedSections.map(s => s.lines.join('\n')).join('\n');
const indexCSS = indexSections.map(s => s.lines.join('\n')).join('\n');

fs.writeFileSync(path.resolve(__dirname, '../src/shared.css'), sharedCSS);
fs.writeFileSync(path.resolve(__dirname, '../src/index.css'), indexCSS);

console.log(`shared.css: ${(sharedCSS.length / 1024).toFixed(1)} KB (${sharedSections.length} 段)`);
console.log(`index.css:  ${(indexCSS.length / 1024).toFixed(1)} KB (${indexSections.length} 段)`);
console.log(`原始 style.css: ${(src.length / 1024).toFixed(1)} KB`);

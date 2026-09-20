import { friendLinks } from './data.js';

// 链接图标映射
const LINK_ICONS = {
  '电影票': '🎬',
  '花店': '💐',
  '寄快递': '📦',
  '上门回收': '♻️',
  'fq1': '🏷️',
  'fq2': '🏷️',
  '苏宁易购': '🛒',
  '当当网': '📚',
  '1688': '🏭',
};

const el = document.getElementById('about-friend-links');
if (el) {
  el.innerHTML = friendLinks.map((f) => {
    const href = f.url || f.link || '#';
    const icon = LINK_ICONS[f.name] || '🔗';
    const desc = f.description
      ? `<span class="friend-link-desc">${f.description}</span>`
      : '';
    const titleAttr = f.description
      ? ` title="${f.description.replace(/"/g, '&quot;')}"`
      : '';
    return `<a href="${href}" target="_blank" rel="noopener sponsored" class="friend-link"${titleAttr}>
      <span class="friend-link-name">
        <span class="link-icon">${icon}</span>
        ${f.name}
        <span class="link-arrow">›</span>
      </span>
      ${desc}
    </a>`;
  }).join('');
}

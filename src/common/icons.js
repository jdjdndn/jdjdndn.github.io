// ========== SVG 图标和封面生成 ==========

export const ICONS = {
  stats_total: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  stats_expired: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  stats_update: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>',
  empty_search: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  ecommerce: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>',
  xiecheng_travel: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>',
  tongcheng_travel: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
  feizhu_travel: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
  other: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
};

// ========== selfData 封面分类 ==========
export const getCategoryForSection = (title) => {
  if (/京东|淘宝|拼多多|电商|闪购/.test(title)) return 'ecommerce';
  if (/携程/.test(title)) return 'travel';
  if (/同程/.test(title)) return 'hotel';
  if (/飞猪/.test(title)) return 'fly';
  if (/滴滴|花小猪|出行|打车/.test(title)) return 'transport';
  if (/餐饮|美食/.test(title)) return 'food';
  if (/电影|娱乐/.test(title)) return 'entertainment';
  if (/会员/.test(title)) return 'member';
  if (/酒店/.test(title)) return 'hotel';
  if (/旅游|旅行/.test(title)) return 'travel';
  return 'other';
};

// ========== selfData 封面 SVG 生成 ==========
export const generateCoverSvg = (_category, name) => {
  const hash = [...name].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const abs = Math.abs(hash);

  const icons = [
    `<circle cx="24" cy="14" r="8" stroke="white" stroke-width="2" fill="none"/><line x1="20" y1="22" x2="14" y2="32" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="28" y1="22" x2="34" y2="32" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="14" y1="32" x2="34" y2="32" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
    `<rect x="12" y="20" width="24" height="14" rx="2" stroke="white" stroke-width="2" fill="none"/><rect x="10" y="16" width="28" height="6" rx="2" stroke="white" stroke-width="2" fill="none"/><line x1="24" y1="16" x2="24" y2="34" stroke="white" stroke-width="2"/><path d="M24 16c-3-6-10-4-6 0" stroke="white" stroke-width="2" fill="none"/><path d="M24 16c3-6 10-4 6 0" stroke="white" stroke-width="2" fill="none"/>`,
    `<circle cx="24" cy="22" r="12" stroke="white" stroke-width="2" fill="none"/><line x1="24" y1="22" x2="24" y2="14" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="24" y1="22" x2="30" y2="22" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="22" r="1.5" fill="white"/>`,
    `<path d="M14 12h14l8 10-14 14L10 22z" stroke="white" stroke-width="2" fill="none"/><circle cx="18" cy="18" r="2" fill="white"/>`,
    `<circle cx="17" cy="17" r="4" stroke="white" stroke-width="2" fill="none"/><circle cx="31" cy="29" r="4" stroke="white" stroke-width="2" fill="none"/><line x1="33" y1="13" x2="15" y2="33" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
    `<polygon points="26,8 16,24 22,24 20,40 34,20 26,20" fill="white" opacity="0.9"/>`,
    `<path d="M24 8c0 6-8 10-8 18 0 5 4 8 8 8s8-3 8-8c0-8-8-12-8-18z" stroke="white" stroke-width="2" fill="none"/><path d="M24 22c0 3-3 5-3 8 0 2 1.5 3 3 3s3-1 3-3c0-3-3-5-3-8z" fill="white" opacity="0.4"/>`,
    `<path d="M8 8h4l3 16h16l3-12H16" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="30" r="2" fill="white"/><circle cx="28" cy="30" r="2" fill="white"/>`,
    `<path d="M24 10c-6 0-10 5-10 10 0 8 10 18 10 18s10-10 10-18c0-5-4-10-10-10z" stroke="white" stroke-width="2" fill="none"/><circle cx="24" cy="20" r="4" stroke="white" stroke-width="2" fill="none"/>`,
    `<polygon points="24,8 36,20 24,38 12,20" stroke="white" stroke-width="2" fill="none" stroke-linejoin="round"/><line x1="12" y1="20" x2="36" y2="20" stroke="white" stroke-width="2"/><line x1="18" y1="14" x2="15" y2="20" stroke="white" stroke-width="1.5"/><line x1="30" y1="14" x2="33" y2="20" stroke="white" stroke-width="1.5"/>`,
    `<circle cx="18" cy="30" r="4" stroke="white" stroke-width="2" fill="none"/><line x1="22" y1="30" x2="22" y2="12" stroke="white" stroke-width="2"/><path d="M22 12h8c2 0 3 2 1 4h-6" stroke="white" stroke-width="2" fill="none"/>`,
    `<polygon points="24,8 27,18 38,18 29,24 32,34 24,28 16,34 19,24 10,18 21,18" stroke="white" stroke-width="2" fill="none" stroke-linejoin="round"/>`,
    `<rect x="10" y="16" width="28" height="20" rx="3" stroke="white" stroke-width="2" fill="none"/><circle cx="24" cy="26" r="5" stroke="white" stroke-width="2" fill="none"/><path d="M18 16l2-4h8l2 4" stroke="white" stroke-width="2" fill="none"/>`,
    `<path d="M10 30l4-14 6 8 4-12 4 12 6-8 4 14z" stroke="white" stroke-width="2" fill="none" stroke-linejoin="round"/><line x1="10" y1="34" x2="38" y2="34" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="14" cy="16" r="1.5" fill="white"/><circle cx="24" cy="12" r="1.5" fill="white"/><circle cx="34" cy="16" r="1.5" fill="white"/>`,
    `<path d="M24 10l-4 10h-8l-2 4h10l-2 10h6l2-10h10l2-4h-8z" stroke="white" stroke-width="2" fill="none" stroke-linejoin="round"/>`,
    `<rect x="14" y="22" width="20" height="14" rx="2" stroke="white" stroke-width="2" fill="none"/><path d="M18 22v-4a6 6 0 0112 0v4" stroke="white" stroke-width="2" fill="none"/><circle cx="24" cy="29" r="2" fill="white"/>`,
    `<path d="M10 12h12v24H10z" stroke="white" stroke-width="2" fill="none"/><path d="M38 12H26v24h12z" stroke="white" stroke-width="2" fill="none"/><line x1="24" y1="12" x2="24" y2="36" stroke="white" stroke-width="2"/>`,
    `<path d="M14 20c-4 0-6 2-6 6s2 6 6 6c2 0 4-1 5-3h8c1 2 3 3 5 3 4 0 6-2 6-6s-2-6-6-6c-1 0-3 1-5 3h-8c-1-2-3-3-5-3z" stroke="white" stroke-width="2" fill="none"/><circle cx="18" cy="26" r="1.5" fill="white"/><circle cx="30" cy="24" r="1.5" fill="white"/><line x1="28" y1="22" x2="32" y2="22" stroke="white" stroke-width="1.5" stroke-linecap="round"/><line x1="30" y1="20" x2="30" y2="24" stroke="white" stroke-width="1.5" stroke-linecap="round"/>`,
    `<circle cx="24" cy="24" r="6" stroke="white" stroke-width="2" fill="none"/><line x1="24" y1="10" x2="24" y2="14" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="24" y1="34" x2="24" y2="38" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="24" x2="14" y2="24" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="34" y1="24" x2="38" y2="24" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="14.1" y1="14.1" x2="17" y2="17" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="31" y1="31" x2="33.9" y2="33.9" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="14.1" y1="33.9" x2="17" y2="31" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="31" y1="17" x2="33.9" y2="14.1" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
    `<path d="M14 30h20c3 0 5-2 5-5s-2-5-5-5c0-4-4-6-7-6-4 0-8 3-8 7 0 0-3 0-3 3s2 6 4 6h4" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path d="M16 12h16v10c0 5-3 8-8 8s-8-3-8-8z" stroke="white" stroke-width="2" fill="none"/><line x1="24" y1="30" x2="24" y2="34" stroke="white" stroke-width="2"/><line x1="18" y1="34" x2="30" y2="34" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="14" y1="16" x2="10" y2="20" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M10 20c0 4 4 6 6 4" stroke="white" stroke-width="2" fill="none"/><line x1="34" y1="16" x2="38" y2="20" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M38 20c0 4-4 6-6 4" stroke="white" stroke-width="2" fill="none"/>`,
    `<circle cx="20" cy="20" r="10" stroke="white" stroke-width="2" fill="none"/><line x1="28" y1="28" x2="38" y2="38" stroke="white" stroke-width="3" stroke-linecap="round"/>`,
    `<circle cx="24" cy="24" r="14" stroke="white" stroke-width="2" fill="none"/><polygon points="24,12 28,24 24,28 20,24" fill="white" opacity="0.9"/><polygon points="24,36 20,24 24,20 28,24" fill="white" opacity="0.4"/>`,
    `<path d="M24 36c-12-8-18-14-18-20a8 8 0 0116 0 8 8 0 0116 0c0 6-6 12-18 20z" stroke="white" stroke-width="2" fill="none"/>`,
  ];

  const palettes = [
    ['#FF6B35', '#FF8F5E'], ['#EC4899', '#F472B6'], ['#3B82F6', '#60A5FA'],
    ['#8B5CF6', '#A78BFA'], ['#F59E0B', '#FBBF24'], ['#10B981', '#34D399'],
    ['#EF4444', '#F87171'], ['#6366F1', '#818CF8'], ['#14B8A6', '#5EEAD4'],
    ['#F97316', '#FB923C'], ['#06B6D4', '#67E8F9'], ['#22C55E', '#86EFAC'],
    ['#D946EF', '#E879F9'], ['#0EA5E9', '#7DD3FC'], ['#EAB308', '#FDE047'],
    ['#A855F7', '#C084FC'], ['#F43F5E', '#FB7185'], ['#059669', '#6EE7B7'],
    ['#7C3AED', '#A78BFA'], ['#EA580C', '#FB923C'], ['#0891B2', '#67E8F9'],
    ['#CA8A04', '#FACC15'], ['#9333EA', '#C084FC'], ['#DC2626', '#FCA5A5'],
  ];

  const icon = icons[abs % 24];
  const [c1, c2] = palettes[(abs >> 3) % 24];
  const label = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').slice(0, 2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="48" height="48" rx="10" fill="url(#bg)"/><text x="24" y="44" text-anchor="middle" font-family="sans-serif" font-size="7" font-weight="bold" fill="white" opacity="0.35">${label}</text>${icon}</svg>`;
  const b64 = typeof btoa === 'function'
    ? btoa(unescape(encodeURIComponent(svg)))
    : Buffer.from(svg, 'utf-8').toString('base64');
  return `data:image/svg+xml;base64,${b64}`;
};

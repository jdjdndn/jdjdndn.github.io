// ========== 数据（来自 data.js） ==========
import QRCode from 'qrcode';
import { track } from './analytics.js';
import { friendLinks, tabs, selfData } from './data.js';

// ========== API 活动数据 ==========
let apiTabsLoaded = false;
const loadApiData = async () => {
  try {
    const res = await fetch('./api-data/act-processed.json');
    if (!res.ok) return;
    const data = await res.json();
    if (!data.tabs?.length) return;

    // 将 API tabs 插入到精选之后
    const jingxuanIdx = tabs.findIndex(t => t.id === 'jingxuan');
    const insertIdx = jingxuanIdx + 1;
    data.tabs.forEach((tab, i) => {
      tab._isApi = true; // 标记为 API 数据
      tabs.splice(insertIdx + i, 0, tab);
    });

    // 将 selfData 的各个 tab 作为子tab放入"其他"主tab
    const otherTab = {
      id: 'other',
      label: '📋 其他',
      name: '其他',
      count: selfData.reduce((sum, tab) => {
        return sum + tab.sections.reduce((s, sec) => s + sec.items.length, 0);
      }, 0),
      hasSubTabs: true,
      sections: selfData.map(tab => ({
        title: tab.name,
        items: tab.sections.flatMap(sec => sec.items),
        _tabLabel: tab.label, // 保留原始label用于显示
        _hasSections: tab.sections.length > 1, // 标记是否有子分组
        _sections: tab.sections, // 保留原始sections结构
      })),
    };

    // 为 selfData 项生成 SVG 封面图
    otherTab.sections.forEach((sec) => {
      const cat = getCategoryForSection(sec.title);
      sec.items.forEach((item) => { if (!item.img) item.img = generateCoverSvg(cat, item.name); });
      if (sec._sections) {
        sec._sections.forEach((sub) => {
          const subCat = getCategoryForSection(sub.title);
          sub.items.forEach((item) => { if (!item.img) item.img = generateCoverSvg(subCat, item.name); });
        });
      }
    });
    tabs.push(otherTab);

    apiTabsLoaded = true;
  } catch {}
};

// ========== 精选活动数据 ==========
let jingxuanData = [];
const loadJingxuan = async () => {
  try {
    const res = await fetch('./api-data/jingxuan_list.json');
    if (!res.ok) return;
    jingxuanData = await res.json();
    // 更新精选 tab 的 badge 数量
    const jingxuanTab = tabs.find(t => t.id === 'jingxuan');
    if (jingxuanTab) {
      jingxuanTab.sections = [{ title: '精选活动', items: jingxuanData.map(d => ({ name: d.name })) }];
    }
    renderStats();
    renderTabNav();
    if (activeTab === 'jingxuan') renderTabContent('jingxuan');
  } catch {}
};

// ========== :has() 兼容性降级 ==========
if (document.body && !CSS.supports('selector(:has(*))')) {
  document.body.classList.add('no-has');
}

// ========== 工具函数 ==========
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/** 防抖：延迟执行，连续触发时重新计时 */
const debounce = (fn, ms = 150) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

const showToast = (msg = '已复制') => {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2500);
};

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast();
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast();
    } catch {
      showToast('复制失败，请长按手动复制');
    }
  }
};

// ========== 过期判断 ==========
const isExpired = (deadline) => {
  if (!deadline) return false;
  const d = new Date(deadline);
  return d < new Date();
};

const isExpiringSoon = (deadline) => {
  if (!deadline) return false;
  const d = new Date(deadline);
  const now = new Date();
  const diff = d - now;
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
};

// ========== DOM 引用 ==========
const tabNav = $('#tab-nav');
const tabContent = $('#tab-content');
const friendLinksEl = $('#friend-links');
const searchInput = $('#search-input');
const searchClear = $('#search-clear');
const searchCount = $('#search-count');
const headerStats = $('#header-stats');
const quickShortcuts = $('#quick-shortcuts');

// ========== SVG 图标 ==========
const ICONS = {
  stats_total: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  stats_expired: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  stats_update: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>',
  empty_search: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  meituan: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/></svg>',
  taobaoshangou: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>',
  ecommerce: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>',
  xiecheng_travel: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>',
  tongcheng_travel: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
  feizhu_travel: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
  didi_ride: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-6.06A1 1 0 0012.38 4H5.62a1 1 0 00-.92.63L2 11l-2 .85A1 1 0 00-.84 12.85V16h3"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>',
  huaxiaozhu_ride: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  dinner: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
  life: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  jingxuan: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  other: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
};

// ========== selfData 封面分类 ==========
const getCategoryForSection = (title) => {
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
const generateCoverSvg = (_category, name) => {
  // 根据名称哈希生成不同图标+配色，每个 item 唯一
  const hash = [...name].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const abs = Math.abs(hash);

  // 12 种不同图标
  const icons = [
    // 购物袋
    `<circle cx="24" cy="14" r="8" stroke="white" stroke-width="2" fill="none"/><line x1="20" y1="22" x2="14" y2="32" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="28" y1="22" x2="34" y2="32" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="14" y1="32" x2="34" y2="32" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
    // 礼物
    `<rect x="12" y="20" width="24" height="14" rx="2" stroke="white" stroke-width="2" fill="none"/><rect x="10" y="16" width="28" height="6" rx="2" stroke="white" stroke-width="2" fill="none"/><line x1="24" y1="16" x2="24" y2="34" stroke="white" stroke-width="2"/><path d="M24 16c-3-6-10-4-6 0" stroke="white" stroke-width="2" fill="none"/><path d="M24 16c3-6 10-4 6 0" stroke="white" stroke-width="2" fill="none"/>`,
    // 时钟
    `<circle cx="24" cy="22" r="12" stroke="white" stroke-width="2" fill="none"/><line x1="24" y1="22" x2="24" y2="14" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="24" y1="22" x2="30" y2="22" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="22" r="1.5" fill="white"/>`,
    // 价签
    `<path d="M14 12h14l8 10-14 14L10 22z" stroke="white" stroke-width="2" fill="none"/><circle cx="18" cy="18" r="2" fill="white"/>`,
    // 百分号
    `<circle cx="17" cy="17" r="4" stroke="white" stroke-width="2" fill="none"/><circle cx="31" cy="29" r="4" stroke="white" stroke-width="2" fill="none"/><line x1="33" y1="13" x2="15" y2="33" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
    // 闪电
    `<polygon points="26,8 16,24 22,24 20,40 34,20 26,20" fill="white" opacity="0.9"/>`,
    // 火焰
    `<path d="M24 8c0 6-8 10-8 18 0 5 4 8 8 8s8-3 8-8c0-8-8-12-8-18z" stroke="white" stroke-width="2" fill="none"/><path d="M24 22c0 3-3 5-3 8 0 2 1.5 3 3 3s3-1 3-3c0-3-3-5-3-8z" fill="white" opacity="0.4"/>`,
    // 购物车
    `<path d="M8 8h4l3 16h16l3-12H16" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="30" r="2" fill="white"/><circle cx="28" cy="30" r="2" fill="white"/>`,
    // 定位
    `<path d="M24 10c-6 0-10 5-10 10 0 8 10 18 10 18s10-10 10-18c0-5-4-10-10-10z" stroke="white" stroke-width="2" fill="none"/><circle cx="24" cy="20" r="4" stroke="white" stroke-width="2" fill="none"/>`,
    // 钻石
    `<polygon points="24,8 36,20 24,38 12,20" stroke="white" stroke-width="2" fill="none" stroke-linejoin="round"/><line x1="12" y1="20" x2="36" y2="20" stroke="white" stroke-width="2"/><line x1="18" y1="14" x2="15" y2="20" stroke="white" stroke-width="1.5"/><line x1="30" y1="14" x2="33" y2="20" stroke="white" stroke-width="1.5"/>`,
    // 音符
    `<circle cx="18" cy="30" r="4" stroke="white" stroke-width="2" fill="none"/><line x1="22" y1="30" x2="22" y2="12" stroke="white" stroke-width="2"/><path d="M22 12h8c2 0 3 2 1 4h-6" stroke="white" stroke-width="2" fill="none"/>`,
    // 星形
    `<polygon points="24,8 27,18 38,18 29,24 32,34 24,28 16,34 19,24 10,18 21,18" stroke="white" stroke-width="2" fill="none" stroke-linejoin="round"/>`,
    // 相机
    `<rect x="10" y="16" width="28" height="20" rx="3" stroke="white" stroke-width="2" fill="none"/><circle cx="24" cy="26" r="5" stroke="white" stroke-width="2" fill="none"/><path d="M18 16l2-4h8l2 4" stroke="white" stroke-width="2" fill="none"/>`,
    // 皇冠
    `<path d="M10 30l4-14 6 8 4-12 4 12 6-8 4 14z" stroke="white" stroke-width="2" fill="none" stroke-linejoin="round"/><line x1="10" y1="34" x2="38" y2="34" stroke="white" stroke-width="2" stroke-linecap="round"/><circle cx="14" cy="16" r="1.5" fill="white"/><circle cx="24" cy="12" r="1.5" fill="white"/><circle cx="34" cy="16" r="1.5" fill="white"/>`,
    // 飞机
    `<path d="M24 10l-4 10h-8l-2 4h10l-2 10h6l2-10h10l2-4h-8z" stroke="white" stroke-width="2" fill="none" stroke-linejoin="round"/>`,
    // 锁
    `<rect x="14" y="22" width="20" height="14" rx="2" stroke="white" stroke-width="2" fill="none"/><path d="M18 22v-4a6 6 0 0112 0v4" stroke="white" stroke-width="2" fill="none"/><circle cx="24" cy="29" r="2" fill="white"/>`,
    // 书本
    `<path d="M10 12h12v24H10z" stroke="white" stroke-width="2" fill="none"/><path d="M38 12H26v24h12z" stroke="white" stroke-width="2" fill="none"/><line x1="24" y1="12" x2="24" y2="36" stroke="white" stroke-width="2"/>`,
    // 游戏手柄
    `<path d="M14 20c-4 0-6 2-6 6s2 6 6 6c2 0 4-1 5-3h8c1 2 3 3 5 3 4 0 6-2 6-6s-2-6-6-6c-1 0-3 1-5 3h-8c-1-2-3-3-5-3z" stroke="white" stroke-width="2" fill="none"/><circle cx="18" cy="26" r="1.5" fill="white"/><circle cx="30" cy="24" r="1.5" fill="white"/><line x1="28" y1="22" x2="32" y2="22" stroke="white" stroke-width="1.5" stroke-linecap="round"/><line x1="30" y1="20" x2="30" y2="24" stroke="white" stroke-width="1.5" stroke-linecap="round"/>`,
    // 太阳
    `<circle cx="24" cy="24" r="6" stroke="white" stroke-width="2" fill="none"/><line x1="24" y1="10" x2="24" y2="14" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="24" y1="34" x2="24" y2="38" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="24" x2="14" y2="24" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="34" y1="24" x2="38" y2="24" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="14.1" y1="14.1" x2="17" y2="17" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="31" y1="31" x2="33.9" y2="33.9" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="14.1" y1="33.9" x2="17" y2="31" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="31" y1="17" x2="33.9" y2="14.1" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
    // 云朵
    `<path d="M14 30h20c3 0 5-2 5-5s-2-5-5-5c0-4-4-6-7-6-4 0-8 3-8 7 0 0-3 0-3 3s2 6 4 6h4" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    // 奖杯
    `<path d="M16 12h16v10c0 5-3 8-8 8s-8-3-8-8z" stroke="white" stroke-width="2" fill="none"/><line x1="24" y1="30" x2="24" y2="34" stroke="white" stroke-width="2"/><line x1="18" y1="34" x2="30" y2="34" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="14" y1="16" x2="10" y2="20" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M10 20c0 4 4 6 6 4" stroke="white" stroke-width="2" fill="none"/><line x1="34" y1="16" x2="38" y2="20" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M38 20c0 4-4 6-6 4" stroke="white" stroke-width="2" fill="none"/>`,
    // 放大镜
    `<circle cx="20" cy="20" r="10" stroke="white" stroke-width="2" fill="none"/><line x1="28" y1="28" x2="38" y2="38" stroke="white" stroke-width="3" stroke-linecap="round"/>`,
    // 指南针
    `<circle cx="24" cy="24" r="14" stroke="white" stroke-width="2" fill="none"/><polygon points="24,12 28,24 24,28 20,24" fill="white" opacity="0.9"/><polygon points="24,36 20,24 24,20 28,24" fill="white" opacity="0.4"/>`,
    // 心形
    `<path d="M24 36c-12-8-18-14-18-20a8 8 0 0116 0 8 8 0 0116 0c0 6-6 12-18 20z" stroke="white" stroke-width="2" fill="none"/>`,
  ];

  // 24 种渐变配色
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

// ========== sections 规范化 ==========
// featured tab 的 sections 可能是原始字符串数组，需要转换为 {title, items} 格式
const normalizeSections = (sections) =>
  sections.map((s) => {
    if (typeof s === 'string') {
      // 从字符串中提取名称和链接
      const lines = s.split('\n').map((l) => l.trim()).filter(Boolean);
      const name = lines[0] || s.slice(0, 30);
      const linkMatch = s.match(/【下单链接】(https?:\/\/\S+)/);
      return {
        title: name.slice(0, 20),
        items: linkMatch
          ? [{ name, link: linkMatch[1] }]
          : [{ name, code: s }],
      };
    }
    return s;
  });

// ========== 统计 ==========
const calcTabCounts = () => tabs.map((t) =>
  normalizeSections(t.sections).reduce((sum, s) => sum + s.items.length, 0),
);
let tabCounts = calcTabCounts();
let totalCount = tabCounts.reduce((a, b) => a + b, 0);

// 渲染头部统计
const renderStats = () => {
  tabCounts = calcTabCounts();
  totalCount = tabCounts.reduce((a, b) => a + b, 0);
  const expiredCount = tabs.reduce((count, tab) => {
    return count + normalizeSections(tab.sections).reduce((sectionCount, section) => {
      return sectionCount + section.items.filter(item => isExpired(item.deadline)).length;
    }, 0);
  }, 0) + jingxuanData.filter(item => isJingxuanExpired(item)).length;
  headerStats.innerHTML = `
    <span class="stat-badge">${ICONS.stats_total} 已收录 <strong>${totalCount}</strong> 个优惠</span>
    ${expiredCount > 0 ? `<span class="stat-badge expired-count">${ICONS.stats_expired} 已过期 <strong>${expiredCount}</strong> 个</span>` : ''}
    <span class="stat-badge">${ICONS.stats_update} 数据持续更新中</span>
  `;
};

// ========== 渲染：快捷入口 ==========
const SHORTCUTS_DATA = [
  { tabId: 'ecommerce', name: '电商', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>', color: 'orange' },
  { tabId: 'xiecheng_travel', name: '携程', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>', color: 'blue' },
  { tabId: 'tongcheng_travel', name: '同程', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>', color: 'blue' },
  { tabId: 'feizhu_travel', name: '飞猪', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>', color: 'green' },
  { tabId: 'life', name: '电影票', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>', color: 'purple' },
];

const renderQuickShortcuts = () => {
  if (!quickShortcuts) return;
  // 只显示 tabs 中存在的快捷入口
  const available = SHORTCUTS_DATA.filter(s => tabs.some(t => t.id === s.tabId));
  quickShortcuts.innerHTML = available.map(s => `
    <button class="quick-shortcut" data-tab="${s.tabId}" data-color="${s.color}" aria-label="${s.name}">
      <span class="quick-shortcut-icon">${s.icon}</span>
      <span class="quick-shortcut-name">${s.name}</span>
    </button>
  `).join('');
};

// ========== 渲染：Tab 导航 ==========
const renderTabNav = () => {
  const tabBtns = tabs
    .map(
      (t, i) => {
        const isActive = t.id === activeTab;
        return `<button class="tab-btn${isActive ? ' active' : ''}" data-tab="${t.id}" role="tab" aria-selected="${isActive}"><span class="tab-name">${t.name || t.label}</span><span class="badge">${tabCounts[i]}</span></button>`;
      },
    )
    .join('');
  tabNav.innerHTML = tabBtns;
};

// Tab 行对齐：仅最后一行不拉伸，保持自然宽度
let alignLock = false;
const alignTabRows = () => {
  if (alignLock) return;
  const btns = Array.from(tabNav.querySelectorAll('.tab-btn'));
  if (!btns.length) return;
  alignLock = true;
  btns.forEach(b => { b.style.flex = ''; });
  const rows = [];
  btns.forEach((b) => {
    const top = b.offsetTop;
    const last = rows[rows.length - 1];
    if (last && Math.abs(last.top - top) < 2) {
      last.indices.push(b);
    } else {
      rows.push({ top, indices: [b] });
    }
  });
  if (rows.length > 1) {
    const lastSet = new Set(rows[rows.length - 1].indices);
    btns.forEach((b) => {
      b.style.flex = lastSet.has(b) ? '0 1 auto' : '1 1 auto';
    });
  }
  requestAnimationFrame(() => { alignLock = false; });
};

// ========== 渲染：卡片 ==========
const renderCodeCard = (item, query) => {
  const isMiniApp = item.code.startsWith('mp://')|| item.code.startsWith('weixin://');
  const expired = isExpired(item.deadline);
  if (hideExpired && expired) return '';
  const expiringSoon = isExpiringSoon(item.deadline);
  const expiredClass = expired ? ' expired' : '';
  const expiringClass = expiringSoon ? ' expiring-soon' : '';
  const expiredTag = expired ? '<span class="expired-tag">已过期</span>' : '';
  return `
  <div class="activity-card${expiredClass}${expiringClass}">
    ${item.img ? `<div class="card-cover"><img class="card-cover-img" src="${item.img}" alt="${item.name}" loading="lazy" /></div>` : ''}
    <div class="card-head">
      <span class="card-name"${query ? ' data-highlight' : ''}>${item.name}</span>
      ${isMiniApp ? '<span class="miniapp-tag">小程序</span>' : ''}
      ${item.deadline ? `<span class="card-deadline">截止 ${item.deadline}</span>` : ''}
      ${expiredTag}
    </div>
    <div class="card-code"${query ? ' data-highlight' : ''}>${item.code}</div>
    <div class="card-actions">
      <button class="btn-copy" data-copy="${item.code.replace(/"/g, '&quot;')}" ${expired ? 'disabled' : ''}>复制口令</button>
      <button class="btn-share" data-share-name="${item.name.replace(/"/g, '&quot;')}" data-share-text="${item.code.replace(/"/g, '&quot;')}">分享</button>
    </div>
  </div>
  `;
};

const renderLinkCard = (item, query) => {
  const expired = isExpired(item.deadline);
  if (hideExpired && expired) return '';
  const expiringSoon = isExpiringSoon(item.deadline);
  const expiredClass = expired ? ' expired' : '';
  const expiringClass = expiringSoon ? ' expiring-soon' : '';
  const expiredTag = expired ? '<span class="expired-tag">已过期</span>' : '';
  let host = '';
  try { host = new URL(item.link).hostname.replace('www.', ''); } catch { host = item.link; }
  return `
  <div class="activity-card${expiredClass}${expiringClass}">
    ${item.img ? `<div class="card-cover"><img class="card-cover-img" src="${item.img}" alt="${item.name}" loading="lazy" /></div>` : ''}
    <div class="card-head">
      <span class="card-name"${query ? ' data-highlight' : ''}>${item.name}</span>
      ${expiredTag}
    </div>
    <a class="card-link" href="${item.link}" target="_blank" rel="noopener" title="${item.link}">${host || '前往活动'}</a>
    <div class="card-actions">
      <a class="btn-go" href="${item.link}" target="_blank" rel="noopener" ${expired ? 'tabindex="-1"' : ''}>前往活动</a>
      <button class="btn-qr" data-link="${item.link}" data-name="${item.name.replace(/"/g, '&quot;')}">二维码</button>
      <button class="btn-share" data-share-name="${item.name.replace(/"/g, '&quot;')}" data-share-url="${item.link}">分享</button>
    </div>
  </div>
  `;
};

// ========== 渲染：精选活动卡片 ==========
const isJingxuanExpired = (item) => item.saleStatus === false;

const renderJingxuanCard = (item) => {
  if (hideExpired && isJingxuanExpired(item)) return '';
  const name = item.brandName ? `${item.brandName} · ${item.name}` : item.name;
  const price = parseFloat(item.sellPrice);
  const origPrice = parseFloat(item.originalPrice);
  const hasDiscount = !isNaN(price) && !isNaN(origPrice) && origPrice > price;
  const hasLink = !!item.h5;
  const expired = isJingxuanExpired(item);
  const tag = expired ? '<span class="jingxuan-tag expired">已下架</span>' : !hasLink ? '<span class="jingxuan-tag">仅门店</span>' : '';
  return `
  <${hasLink ? 'a' : 'div'} class="jingxuan-card${hasLink ? '' : ' no-link'}${expired ? ' expired' : ''}"${hasLink ? ` href="${item.h5}" target="_blank" rel="noopener"` : ''}>
    <div class="jingxuan-img-wrap">
      <img class="jingxuan-img" src="${item.img}" alt="${name}" loading="lazy" />
      ${tag}
    </div>
    <div class="jingxuan-info">
      <div class="jingxuan-name">${name}</div>
      <div class="jingxuan-price">
        ${hasDiscount ? `<span class="jingxuan-price-sell">¥${item.sellPrice}</span><span class="jingxuan-price-orig">¥${item.originalPrice}</span>` : item.sellPrice ? `<span class="jingxuan-price-sell">¥${item.sellPrice}</span>` : ''}
      </div>
    </div>
  </${hasLink ? 'a' : 'div'}>`;
};

// ========== 渲染：API 活动卡片 ==========
const renderApiCard = (item, query) => {
  const hasLink = item.actionType === 'link' && !!item.link;
  const hasMini = item.actionType === 'miniprogram' && !!item.appId;
  const hasTkl = item.actionType === 'tkl' && !!item.tkl;

  const dateInfo = item.startDate && item.endDate
    ? `<span class="api-card-date">📅 ${item.startDate} ~ ${item.endDate}</span>`
    : '';

  const imgHtml = item.img
    ? `<img class="api-card-img" src="${item.img}" alt="${item.name}" loading="lazy" />`
    : '';

  let actionHtml = '';
  if (hasLink) {
    actionHtml = `<a class="btn-go" href="${item.link}" target="_blank" rel="noopener">前往活动</a>`;
  } else if (hasMini) {
    actionHtml = `<span class="api-card-miniapp">小程序</span>`;
  } else if (hasTkl) {
    actionHtml = `<button class="btn-copy" data-tkl="${item.tkl.replace(/"/g, '&quot;')}">复制口令</button>`;
  }

  return `
  <div class="activity-card api-card">
    ${imgHtml}
    <div class="api-card-body">
      <div class="card-head">
        <span class="card-name"${query ? ' data-highlight' : ''}>${item.name}</span>
      </div>
      ${dateInfo ? `<div class="api-card-meta">${dateInfo}</div>` : ''}
      <div class="card-actions">
        ${actionHtml}
        ${hasLink ? `<button class="btn-qr" data-link="${item.link}" data-name="${item.name.replace(/"/g, '&quot;')}">二维码</button>` : ''}
        <button class="btn-share" data-share-name="${item.name.replace(/"/g, '&quot;')}" data-share-url="${item.link || ''}">分享</button>
      </div>
    </div>
  </div>`;
};

// ========== 渲染：Tab 内容 ==========
// 当前激活的子tab
let activeSubTab = {};

const renderTabContent = (tabId) => {
  const tab = tabs.find((t) => t.id === tabId);
  if (!tab) return;

  // 精选活动：从 JSON 加载，渲染图片卡片
  if (tabId === 'jingxuan') {
    if (!jingxuanData.length) {
      tabContent.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
          <div class="empty-state-title">精选活动加载中…</div>
          <div class="empty-state-hint">请稍候</div>
        </div>`;
      loadJingxuan();
      return;
    }

    const visibleJxData = hideExpired ? jingxuanData.filter(d => !isJingxuanExpired(d)) : jingxuanData;
    const html = visibleJxData.length
      ? `<section class="sub-section"><h2 class="sub-section-title">精选活动（${visibleJxData.length}）</h2><div class="jingxuan-grid">${visibleJxData.map(renderJingxuanCard).join('')}</div></section>`
      : `<div class="empty-state">
          <div class="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
          <div class="empty-state-title">精选活动即将上线</div>
          <div class="empty-state-hint">敬请期待，我们会为你挑选最值得入手的优惠</div>
        </div>`;
    tabContent.innerHTML = html;
    return;
  }

  const sections = normalizeSections(tab.sections);

  if (!sections.length) {
    tabContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <div class="empty-state-title">精选活动即将上线</div>
        <div class="empty-state-hint">敬请期待，我们会为你挑选最值得入手的优惠</div>
      </div>
    `;
    return;
  }

  // 有子tab的情况
  if (tab.hasSubTabs && sections.length > 1) {
    // 初始化或获取当前激活的子tab
    if (!activeSubTab[tabId]) {
      activeSubTab[tabId] = sections[0].title;
    }
    const currentSubTab = activeSubTab[tabId];
    const currentSection = sections.find(s => s.title === currentSubTab) || sections[0];

    // 渲染子tab导航（使用 _tabLabel 如果有）
    const subTabNavHtml = `
      <div class="sub-tab-nav">
        ${sections.map(sec => {
          const displayLabel = sec._tabLabel || sec.title;
          return `
          <button class="sub-tab-btn ${sec.title === currentSubTab ? 'active' : ''}"
                  data-subtab="${sec.title}">
            ${displayLabel}（${sec.items.length}）
          </button>
        `;}).join('')}
      </div>
    `;

    // 渲染当前子tab的内容
    // 检查是否有子分组（selfData的tab可能有自己的sections）
    const contentHtml = currentSection._hasSections
      ? currentSection._sections.map(sec => `
          <section class="sub-section">
            <h2 class="sub-section-title">${sec.title}（${sec.items.length}）</h2>
            <div class="card-grid">
              ${sec.items.map((item) => {
                if (item.actionType) return renderApiCard(item);
                return item.code ? renderCodeCard(item) : renderLinkCard(item);
              }).join('')}
            </div>
          </section>
        `).join('')
      : `
          <section class="sub-section">
            <div class="card-grid">
              ${currentSection.items.map((item) => {
                if (item.actionType) return renderApiCard(item);
                return item.code ? renderCodeCard(item) : renderLinkCard(item);
              }).join('')}
            </div>
          </section>
        `;

    tabContent.innerHTML = subTabNavHtml + contentHtml;
    return;
  }

  // 没有子tab的情况
  tabContent.innerHTML = sections
    .map(
      (sec, i) => `
    <section class="sub-section" aria-labelledby="section-${tab.id}-${i}">
      <h2 class="sub-section-title" id="section-${tab.id}-${i}">${sec.title}（${sec.items.length}）</h2>
      <div class="card-grid">
        ${sec.items.map((item) => {
          // API 活动卡片（有 img 和 actionType 字段）
          if (item.actionType) return renderApiCard(item);
          // 原有的口令/链接卡片
          return item.code ? renderCodeCard(item) : renderLinkCard(item);
        }).join('')}
      </div>
    </section>
  `,
    )
    .join('');
};

// ========== 渲染：友情链接 ==========
const renderFriendLinks = () => {
  const huiyuanEntry = `<a class="friend-link friend-link-highlight" href="./huiyuan.html">会员优惠</a>`;
  const haokaEntry = `<a class="friend-link friend-link-highlight" href="./haoka.html">号卡专区</a>`;
  const wifiEntry = `<a class="friend-link friend-link-highlight" href="./wifi.html">随身WiFi</a>`;
  const wangpanEntry = `<a class="friend-link friend-link-highlight" href="./wangpan.html">网盘资源</a>`;
  friendLinksEl.innerHTML = haokaEntry + wifiEntry + wangpanEntry + huiyuanEntry + friendLinks
    .map((f) => {
      const description = f.description ? ` title="${f.description.replace(/"/g, '&quot;')}"` : '';
      const category = f.category ? ` data-category="${f.category}"` : '';
      return `<a class="friend-link" href="${f.url}" target="_blank" rel="noopener sponsored"${description}${category}>${f.name}</a>`;
    })
    .join('');
};

// ========== Tab 切换 ==========
let activeTab = tabs[0].id;

const switchTab = (tabId) => {
  activeTab = tabId;
  track('tab_switch', { tab: tabId });
  localStorage.setItem('activeTab', tabId);
  // 更新 URL hash
  history.replaceState(null, '', `#${tabId}`);
  // 更新按钮状态和 ARIA
  $$('.tab-btn').forEach((btn) => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });
  // H5 端自动将当前 tab 滚入可视区域
  const activeBtn = tabNav.querySelector('.tab-btn.active');
  if (activeBtn) {
    activeBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }
  renderTabContent(tabId);
};

// ========== 过期筛选 ==========
let hideExpired = localStorage.getItem('hideExpired') === 'true';
let footerCollapsed = localStorage.getItem('footerCollapsed') === 'true';

const toggleHideExpired = () => {
  hideExpired = !hideExpired;
  localStorage.setItem('hideExpired', hideExpired);
  const btn = $('#hide-expired');
  if (btn) {
    btn.classList.toggle('active', hideExpired);
    btn.setAttribute('aria-pressed', hideExpired);
  }
  // 重新渲染当前 tab
  renderTabContent(activeTab);
  if (searchQuery) handleSearch();
};

// ========== 事件委托 ==========
// 快捷入口点击
if (quickShortcuts) {
  quickShortcuts.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-shortcut');
    if (btn) switchTab(btn.dataset.tab);
  });
}

tabNav.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (btn) switchTab(btn.dataset.tab);
});

// 子tab点击事件
tabContent.addEventListener('click', (e) => {
  const subTabBtn = e.target.closest('.sub-tab-btn');
  if (subTabBtn) {
    const subTabName = subTabBtn.dataset.subtab;
    const tab = tabs.find(t => t.id === activeTab);
    if (tab && subTabName) {
      activeSubTab[activeTab] = subTabName;
      renderTabContent(activeTab);
    }
  }
});

// Tab 键盘导航（左右箭头）
tabNav.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  const btns = Array.from(tabNav.querySelectorAll('.tab-btn'));
  const idx = btns.indexOf(document.activeElement);
  if (idx === -1) return;
  e.preventDefault();
  const next = e.key === 'ArrowRight'
    ? (idx + 1) % btns.length
    : (idx - 1 + btns.length) % btns.length;
  btns[next].focus();
  switchTab(btns[next].dataset.tab);
});

tabContent.addEventListener('click', (e) => {
  const copyBtn = e.target.closest('.btn-copy');
  if (copyBtn) {
    if (copyBtn.disabled) return;
    // API 卡片的口令复制（data-tkl）
    const tklText = copyBtn.dataset.tkl;
    const codeText = copyBtn.dataset.copy;
    const text = tklText
      ? tklText.replace(/&quot;/g, '"').replace(/&amp;/g, '&')
      : (codeText || '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (!text) return;
    const cardName = copyBtn.closest('.activity-card')?.querySelector('.card-name')?.textContent || '';
    track('copy_code', { name: cardName });
    copyText(text);
    // 按钮反馈
    copyBtn.classList.add('success');
    const orig = copyBtn.textContent;
    copyBtn.textContent = '✓ 已复制';
    setTimeout(() => {
      copyBtn.textContent = orig;
      copyBtn.classList.remove('success');
    }, 1500);
    return;
  }

  const qrBtn = e.target.closest('.btn-qr');
  if (qrBtn) {
    track('qr_generate', { name: qrBtn.dataset.name });
    showQrModal(qrBtn.dataset.link, qrBtn.dataset.name);
    return;
  }

  const shareBtn = e.target.closest('.btn-share');
  if (shareBtn) {
    track('share', { name: shareBtn.dataset.shareName });
    shareItem(shareBtn.dataset.shareName, shareBtn.dataset.shareUrl, shareBtn.dataset.shareText || '');
  }
});

// ========== 搜索 ==========
let searchQuery = '';

const searchCoupons = (query) => {
  if (!query.trim()) return null;
  const q = query.toLowerCase();
  const results = [];
  tabs.forEach((tab) => {
    normalizeSections(tab.sections).forEach((sec) => {
      sec.items.forEach((item) => {
        if (hideExpired && isExpired(item.deadline)) return;
        // API 活动：检查过期
        if (item.endDate && item.endDate < new Date().toISOString().slice(0, 10)) return;
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.code && item.code.toLowerCase().includes(q);
        const matchDesc = item.desc && item.desc.toLowerCase().includes(q);
        const matchTkl = item.tkl && item.tkl.toLowerCase().includes(q);
        const matchSection = sec.title.toLowerCase().includes(q);
        if (matchName || matchCode || matchDesc || matchTkl || matchSection) {
          results.push({ ...item, tabLabel: tab.label, tabId: tab.id, sectionTitle: sec.title });
        }
      });
    });
  });
  // 搜索精选活动数据
  jingxuanData.forEach((d) => {
    if (hideExpired && isJingxuanExpired(d)) return;
    const fullName = d.brandName ? `${d.brandName} ${d.name}` : d.name;
    if (fullName.toLowerCase().includes(q)) {
      results.push({ name: fullName, link: d.h5 || '#', tabLabel: '⭐ 精选', tabId: 'jingxuan', sectionTitle: '精选活动' });
    }
  });
  return results;
};

const renderSearchResults = (results) => {
  if (!results.length) {
    tabContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${ICONS.empty_search}</div>
        <div class="empty-state-title">未找到匹配的优惠</div>
        <div class="empty-state-hint">换个关键词试试？</div>
      </div>
    `;
    return;
  }

  // 按 tab + section 分组
  const grouped = {};
  results.forEach((item) => {
    const key = `${item.tabId}__${item.sectionTitle || ''}`;
    if (!grouped[key]) grouped[key] = { label: item.tabLabel, sectionTitle: item.sectionTitle || '', items: [] };
    grouped[key].items.push(item);
  });

  tabContent.innerHTML = Object.values(grouped)
    .map(
      (group) => `
    <div class="sub-section">
      <div class="sub-section-title">${group.label}${group.sectionTitle ? ' · ' + group.sectionTitle : ''}（${group.items.length}）</div>
      <div class="card-grid">
        ${group.items.map((item) => {
          if (item.actionType) return renderApiCard(item, searchQuery);
          return item.code ? renderCodeCard(item, searchQuery) : renderLinkCard(item, searchQuery);
        }).join('')}
      </div>
    </div>
  `,
    )
    .join('');
};

const handleSearch = () => {
  const query = searchInput.value.trim();
  searchQuery = query;

  if (!query) {
    track('search_clear');
    searchClear.classList.remove('visible');
    searchCount.classList.remove('visible');
    renderTabContent(activeTab);
    return;
  }

  searchClear.classList.add('visible');
  const results = searchCoupons(query);
  track('search', { query, results_count: results.length });
  searchCount.textContent = `找到 ${results.length} 个匹配结果`;
  searchCount.classList.add('visible');
  renderSearchResults(results);
};

const debouncedSearch = debounce(handleSearch, 150);

searchInput.addEventListener('input', debouncedSearch);
searchClear.addEventListener('click', () => {
  searchInput.value = '';
  handleSearch();
  searchInput.focus();
});

// 过期筛选按钮
// const filterBar = $('#filter-bar');
// filterBar.addEventListener('click', (e) => {
//   if (e.target.closest('.hide-expired-toggle')) {
//     toggleHideExpired();
//   }
// });

// ========== 二维码弹窗 ==========
const qrOverlay = $('#qr-overlay');
const qrImg = $('#qr-img');
const qrName = $('#qr-name');
const qrClose = $('#qr-close');

// ========== 焦点陷阱 ==========
let lastFocusedElement = null;

const showQrModal = async (url, name) => {
  lastFocusedElement = document.activeElement;
  const qrLoading = $('#qr-loading');
  qrLoading.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg><span>生成中…</span>';
  qrLoading.classList.remove('hidden');
  qrImg.classList.add('hidden');
  qrName.textContent = name;
  qrOverlay.classList.remove('hidden');
  qrClose.focus();
  try {
    qrImg.src = await QRCode.toDataURL(url, { width: 240, margin: 2 });
    qrLoading.classList.add('hidden');
    qrImg.classList.remove('hidden');
  } catch {
    qrLoading.innerHTML = '<span style="color:var(--danger)">生成失败，请重试</span>';
  }
};

const hideQrModal = () => {
  qrOverlay.classList.add('hidden');
  qrImg.src = '';
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
};

const qrModal = qrOverlay.querySelector('.qr-modal');
const getFocusableEls = () =>
  qrModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

qrClose.addEventListener('click', hideQrModal);
qrOverlay.addEventListener('click', (e) => {
  if (e.target === qrOverlay) hideQrModal();
});
document.addEventListener('keydown', (e) => {
  if (qrOverlay.classList.contains('hidden')) return;

  if (e.key === 'Escape') {
    hideQrModal();
    return;
  }

  // 焦点陷阱：Tab 循环
  if (e.key === 'Tab') {
    const focusable = Array.from(getFocusableEls());
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// ========== 键盘快捷键 ==========
document.addEventListener('keydown', (e) => {
  // "/" 聚焦搜索框（排除已在输入框中的情况）
  if (e.key === '/' && document.activeElement !== searchInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    searchInput.focus();
  }
});

// ========== URL hash 同步 ==========
const handleHashChange = () => {
  const hash = window.location.hash.slice(1);
  if (hash && tabs.some((t) => t.id === hash)) {
    switchTab(hash);
  }
};
window.addEventListener('hashchange', handleHashChange);

// ========== 暗色模式 ==========
const initDarkMode = () => {
  const saved = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'true' || (!saved && prefersDark)) {
    document.body.classList.add('dark-mode');
  }
  updateDarkToggleText();
};

const updateDarkToggleText = () => {
  const textEl = $('#dark-toggle-text');
  if (textEl) textEl.textContent = document.body.classList.contains('dark-mode') ? '亮色' : '暗色';
};

const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  track('dark_mode_toggle', { mode: isDark ? 'dark' : 'light' });
  localStorage.setItem('darkMode', isDark);
  updateDarkToggleText();
};

// ========== 分享 ==========
// 创建分享面板 DOM（仅创建一次）
const createSharePanel = () => {
  if ($('#share-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'share-panel';
  panel.className = 'share-panel hidden';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', '分享');
  panel.innerHTML = `
    <div class="share-panel-mask"></div>
    <div class="share-panel-body">
      <div class="share-panel-header">
        <span class="share-panel-title">分享给朋友</span>
        <button class="share-panel-close" aria-label="关闭">✕</button>
      </div>
      <div class="share-panel-content">
        <p class="share-panel-name" id="share-panel-name"></p>
        <div class="share-panel-options">
          <button class="share-option" data-action="copy-link">
            <span class="share-option-icon">🔗</span>
            <span class="share-option-label">复制链接</span>
          </button>
          <button class="share-option" data-action="copy-text">
            <span class="share-option-icon">📋</span>
            <span class="share-option-label">复制口令</span>
          </button>
          <button class="share-option" data-action="wechat">
            <span class="share-option-icon">💬</span>
            <span class="share-option-label">微信</span>
          </button>
          <button class="share-option" data-action="weibo">
            <span class="share-option-icon">📢</span>
            <span class="share-option-label">微博</span>
          </button>
          <button class="share-option" data-action="qq">
            <span class="share-option-icon">🐧</span>
            <span class="share-option-label">QQ</span>
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // 关闭面板
  const closePanel = () => panel.classList.add('hidden');
  panel.querySelector('.share-panel-close').addEventListener('click', closePanel);
  panel.querySelector('.share-panel-mask').addEventListener('click', closePanel);
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });

  // 处理分享选项
  panel.querySelector('.share-panel-options').addEventListener('click', async (e) => {
    const option = e.target.closest('.share-option');
    if (!option) return;
    const action = option.dataset.action;
    const shareUrl = panel.dataset.shareUrl || window.location.href;
    const shareName = panel.dataset.shareName || '';
    const shareText = panel.dataset.shareText || '';

    if (action === 'copy-link') {
      await robustCopy(shareUrl, '链接已复制');
    } else if (action === 'copy-text') {
      const content = shareText || shareUrl;
      await robustCopy(content, shareText ? '口令已复制' : '链接已复制');
    } else if (action === 'wechat') {
      // 微信：复制内容，引导用户去微信粘贴
      const content = shareText || `${shareName} ${shareUrl}`;
      await robustCopy(content, '已复制，打开微信粘贴发送');
    } else if (action === 'weibo') {
      const wbUrl = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(shareName)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(wbUrl, '_blank', 'noopener,width=600,height=500');
    } else if (action === 'qq') {
      const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?title=${encodeURIComponent(shareName)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(qqUrl, '_blank', 'noopener,width=600,height=500');
    }
    closePanel();
  });
};

/** 剪贴板写入（含降级） */
const robustCopy = async (text, successMsg) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMsg);
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(successMsg);
    } catch {
      showToast('复制失败，请长按手动复制');
    }
  }
};

createSharePanel();

const shareItem = async (name, url, text) => {
  // 移动端：优先用原生分享
  if (navigator.share) {
    const shareData = text
      ? { title: name, text }
      : { title: name, url };
    try { await navigator.share(shareData); return; } catch {}
  }
  // 桌面端 / 原生分享失败：弹出分享面板
  const panel = $('#share-panel');
  panel.dataset.shareName = name || '';
  panel.dataset.shareUrl = url || window.location.href;
  panel.dataset.shareText = text || '';
  $('#share-panel-name').textContent = name || '';
  panel.classList.remove('hidden');
  panel.querySelector('.share-panel-close').focus();
};

// ========== 初始化 ==========
const init = async () => {
  initDarkMode();
  // 加载 API 活动数据（插入到精选之后、selfData 之前）
  await loadApiData();
  // 同步 localStorage 中的过期筛选状态到 UI
  if (hideExpired) {
    const hideBtn = $('#hide-expired');
    if (hideBtn) {
      hideBtn.classList.add('active');
      hideBtn.setAttribute('aria-pressed', 'true');
    }
  }
  renderStats();
  renderTabNav();
  renderQuickShortcuts();
  loadJingxuan();

  // 支持 URL hash 直接定位，无 hash 时从 localStorage 恢复
  const initialHash = window.location.hash.slice(1);
  if (initialHash && tabs.some((t) => t.id === initialHash)) {
    activeTab = initialHash;
  } else {
    const saved = localStorage.getItem('activeTab');
    if (saved && tabs.some((t) => t.id === saved)) {
      activeTab = saved;
    }
  }
  switchTab(activeTab);

  renderFriendLinks();
};

init();

if (typeof ResizeObserver !== 'undefined') {
  new ResizeObserver(alignTabRows).observe(tabNav);
} else {
  window.addEventListener('resize', debounce(alignTabRows, 200));
  alignTabRows();
}

// ========== Footer 吸底宽度同步 + 收起 ==========
const appEl = $('#app');
const footer = $('#footer');
const footerToggle = $('#footer-toggle');
const footerInner = document.querySelector('.footer-inner');
const syncFooter = () => {
  const style = getComputedStyle(appEl);
  footerInner.style.maxWidth = style.maxWidth;
  footerInner.style.marginLeft = style.marginLeft;
  footerInner.style.marginRight = style.marginRight;
};
syncFooter();
window.addEventListener('resize', syncFooter);

// Footer 初始化收起状态
if (footerCollapsed) {
  footer.classList.add('collapsed');
  footerToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.add('footer-collapsed');
}

// Footer 收起/展开
footerToggle.addEventListener('click', () => {
  const collapsed = footer.classList.toggle('collapsed');
  footerToggle.setAttribute('aria-expanded', !collapsed);
  document.body.classList.toggle('footer-collapsed', collapsed);
  localStorage.setItem('footerCollapsed', collapsed);
});

// 暗色模式切换
const darkToggle = $('#dark-toggle');
if (darkToggle) darkToggle.addEventListener('click', toggleDarkMode);

// ========== Tab 导航吸顶检测 ==========
if (typeof IntersectionObserver !== 'undefined') {
  const sentinel = document.createElement('div');
  sentinel.style.height = '1px';
  sentinel.style.position = 'absolute';
  sentinel.style.top = '-1px';
  sentinel.style.visibility = 'hidden';
  tabNav.parentNode.insertBefore(sentinel, tabNav);
  new IntersectionObserver(([entry]) => {
    tabNav.classList.toggle('is-stuck', !entry.isIntersecting);
  }).observe(sentinel);
}

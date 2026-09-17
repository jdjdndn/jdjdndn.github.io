/**
 * 构建脚本：读取 api-data/*.json，生成页面可用的 src/jutuike-data.js
 *
 * 输入：
 *   api-data/act-list.json             — 活动列表
 *   api-data/act-links.json            — 活动推广链接
 *   api-data/meituan-coupons.json      — 美团券包
 *   api-data/meituan-coupon-links.json — 美团券包推广链接
 *   api-data/ele-brand-list.json       — 饿了么品牌活动列表
 *   api-data/ele-brand-links.json      — 饿了么品牌活动推广链接
 *
 * 输出：
 *   src/jutuike-data.js — export { activities, meituanCoupons }
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const apiDir = path.join(ROOT, 'api-data');
const outPath = path.join(ROOT, 'src', 'jutuike-data.js');

function readJSON(filename) {
  const fp = path.join(apiDir, filename);
  if (!fs.existsSync(fp)) {
    console.warn(`⚠️  ${filename} 不存在，跳过`);
    return [];
  }
  return JSON.parse(fs.readFileSync(fp, 'utf-8'));
}

// ========== 读取原始数据 ==========
const actList = readJSON('act-list.json');
const actLinks = readJSON('act-links.json');
const meituanCoupons = readJSON('meituan-coupons.json');
const meituanCouponLinks = readJSON('meituan-coupon-links.json');
const eleBrandList = readJSON('ele-brand-list.json');
const eleBrandLinks = readJSON('ele-brand-links.json');

// ========== 合并活动列表 + 推广链接 ==========
const linkMap = new Map();
for (const link of actLinks) {
  linkMap.set(link.act_id, link);
}

// 过滤佣金相关词语
function stripCommissionWords(str) {
  if (!str) return '';
  return str
    .replace(/高佣/g, '')
    .replace(/CPS/g, '')
    .replace(/cps/g, '')
    .replace(/佣金率/g, '')
    .replace(/佣金比例/g, '')
    .replace(/佣金/g, '')
    .replace(/出佣/g, '')
    .replace(/返佣/g, '')
    .replace(/结佣/g, '')
    .replace(/分佣/g, '')
    .replace(/预估\s*/g, '')
    .replace(/高至/g, '')
    .replace(/[，,]\s*$/g, '')
    .replace(/^\s*[，,]/g, '')
    .replace(/\r?\n/g, '')
    .trim();
}

const CATE_ORDER = [
  '美团', '饿了么', '京东外卖', '打车出行', '特惠酒店',
  '电影票', '快递优惠', '连锁餐饮', '本地生活', '电商',
];

// 关键词分类规则（按优先级从高到低匹配，先命中先得）
const CATE_RULES = [
  { category: '京东外卖', keywords: ['京东外卖', '京东大牌冰饮'] },
  { category: '美团',     keywords: ['美团', '外卖'] },
  { category: '饿了么',   keywords: ['饿了么', '淘宝闪购'] },
  { category: '特惠酒店', keywords: ['酒店', '民宿', '住宿'] },
  { category: '打车出行', keywords: ['打车', '滴滴', '高德打车', '曹操', '花小猪', 'T3出行', '租车'] },
  { category: '电影票',   keywords: ['电影票', '电影', '门票', '乐园'] },
  { category: '快递优惠', keywords: ['快递', '寄件'] },
  { category: '连锁餐饮', keywords: ['瑞幸', '星巴克', '麦当劳', '肯德基', '必胜客', '蜜雪', '茶百道', '古茗', '沪上阿姨', '库迪', '霸王茶姬'] },
];

// 个别活动手动覆盖（仅用于关键词规则无法覆盖的特殊情况）
const CATE_MANUAL = {
  36: '美团',       // 玩乐变美天天领红包（美团团购）
  54: '美团',   // 大牌乐园限时热销（被"乐园"关键词误匹配到电影票）
  95: '打车出行',   // 机票新客CPA+老客CPS
  108: '京东外卖',  // 京东爆品双份低至9.9
  142: '本地生活',  // 飞猪签证推广活动
  144: '本地生活',  // 飞猪度假会场
  148: '本地生活',  // 飞猪特价门票（被"门票"关键词误匹配到电影票）
};

// 综合分类：手动覆盖 > 关键词规则 > API 原始分类
function resolveCategory(act) {
  if (act.act_id in CATE_MANUAL) return CATE_MANUAL[act.act_id];
  const name = act.act_name || '';
  for (const rule of CATE_RULES) {
    if (rule.keywords.some(kw => name.includes(kw))) return rule.category;
  }
  return act.cate_name || '其他';
}

const activities = actList
  .filter((act) => {
    const link = linkMap.get(act.act_id);
    return link && (link.h5 || link.tkl);
  })
  .map((act) => {
    const link = linkMap.get(act.act_id);
    return {
      act_id: act.act_id,
      name: stripCommissionWords(act.act_name),
      category: resolveCategory(act),
      desc: stripCommissionWords(act.desc),
      icon: act.icon || '',
      img: act.img || '',
      poster: act.poster || '',
      startDate: act.start_date || '',
      endDate: act.end_date || '',
      h5: link.h5 || '',
      longH5: link.long_h5 || '',
      tkl: link.tkl || '',
      miniAppId: link.we_app_info?.app_id || '',
      miniAppPath: link.we_app_info?.page_path || '',
    };
  })
  .sort((a, b) => {
    const ia = CATE_ORDER.indexOf(a.category);
    const ib = CATE_ORDER.indexOf(b.category);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

// 清洗美团券包数据（去掉佣金字段）
const cleanMeituanCoupons = meituanCoupons.map(({ commission_rate_des, ...rest }) => rest);

// 券包链接索引
const couponLinkMap = new Map();
for (const link of meituanCouponLinks) {
  couponLinkMap.set(link.coupon_id, link);
}

// 解析活动日期范围（"2026-04-29 至 2026-12-31"）
function parseActivityDate(dateStr) {
  if (!dateStr) return { startDate: '', endDate: '' };
  const parts = dateStr.split('至').map(s => s.trim());
  return { startDate: parts[0] || '', endDate: parts[1] || '' };
}

// 将美团券包转换为活动格式，合并到美团分类
const couponActivities = cleanMeituanCoupons
  .filter((c) => {
    const link = couponLinkMap.get(c.coupon_id);
    return link && (link.h5 || link.short_h5);
  })
  .map((c, i) => {
    const link = couponLinkMap.get(c.coupon_id) || {};
    const { startDate, endDate } = parseActivityDate(c.activity_date);
    return {
      act_id: `coupon_${c.coupon_id}`,
      name: c.title,
      category: '美团',
      desc: c.xcx_short_title || c.title,
      icon: c.bg_images || '',
      img: '',
      poster: '',
      startDate,
      endDate,
      h5: link.short_h5 || link.h5 || '',
      longH5: link.h5 || '',
      tkl: '',
      miniAppId: link.we_app_info?.app_id || '',
      miniAppPath: link.we_app_info?.page_path || '',
      _isCoupon: true,
    };
  });

activities.push(...couponActivities);

// ========== 饿了么品牌活动 → 饿了么分类 ==========
const eleBrandLinkMap = new Map();
for (const link of eleBrandLinks) {
  eleBrandLinkMap.set(String(link.coupon_id), link);
}

const eleBrandActivities = eleBrandList
  .filter((b) => {
    const link = eleBrandLinkMap.get(String(b.coupon_id));
    return link && (link.h5 || link.tkl);
  })
  .map((b) => {
    const link = eleBrandLinkMap.get(String(b.coupon_id)) || {};
    const startDate = b.start_time ? b.start_time.split(' ')[0] : '';
    const endDate = b.end_time ? b.end_time.split(' ')[0] : '';
    return {
      act_id: `ele_${b.coupon_id}`,
      name: stripCommissionWords(b.xcx_short_title || b.title),
      category: '饿了么',
      desc: stripCommissionWords(b.title),
      icon: b.icon || '',
      img: '',
      poster: '',
      startDate,
      endDate,
      h5: link.h5 || '',
      longH5: link.long_h5 || '',
      tkl: link.tkl || '',
      miniAppId: link.miniAppId || '',
      miniAppPath: link.miniAppPath || '',
      _isEleBrand: true,
    };
  });

activities.push(...eleBrandActivities);

// ========== 生成 JS 模块 ==========
const js = `// 自动生成 — 请勿手动编辑
// 生成时间: ${new Date().toISOString()}

// eslint-disable
`;

const activitiesStr = JSON.stringify(activities, null, 2);

const output = `${js}
export const activities = ${activitiesStr};

// 兼容旧导入（已废弃，内容已合并到 activities）
export const meituanCoupons = [];
`;

fs.writeFileSync(outPath, output, 'utf-8');
console.log(`✅ jutuike-data.js 已生成: ${activities.length} 个活动 (${couponActivities.length} 个券包, ${eleBrandActivities.length} 个饿了么品牌)`);

// 构建时生成 llms.txt / llms-full.txt（GEO：AI 搜索引擎可读索引）
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import {
  SITE_URL, ROOT, discoverArticlePages, discoverSubPages,
  readPageTitle, loadTabs, loadLandingSlugs,
} from './shared.js';

async function buildLlms() {
  const tabs = await loadTabs();
  const articles = Object.entries(discoverArticlePages())
    .sort(([a], [b]) => a.localeCompare(b, 'zh-CN'))
    .map(([name, filePath]) => ({
      name: name.replace('article/', ''),
      title: readPageTitle(filePath, name.replace('article/', '')),
    }));
  const subPages = discoverSubPages();
  const landingSlugs = await loadLandingSlugs();

  const totalCoupons = tabs.reduce((sum, t) => sum + (t.sections || []).reduce((s, sec) => s + sec.items.length, 0), 0);

  const categoryLines = tabs.map((tab) => {
    const secLines = (tab.sections || [])
      .map((sec) => `  - ${sec.title}（${sec.items.length} 项）：${sec.items.slice(0, 8).map((i) => i.name).join('、')}${sec.items.length > 8 ? ' 等' : ''}`)
      .join('\n');
    return `### ${tab.label}\n${secLines}`;
  }).join('\n\n');

  const articleLinks = articles.map((a) => `- [${a.title}](${SITE_URL}/article/${encodeURI(a.name)}.html)`).join('\n');
  const subPageLinks = subPages.map((n) => `- ${n}: ${SITE_URL}/${n}.html`).join('\n');
  const landingLinks = landingSlugs.map((n) => `- ${n}: ${SITE_URL}/${n}.html`).join('\n');

  const llms = `# 券宝 — 优惠活动聚合

> 一站式优惠券导航站，收录超过 ${totalCoupons} 个优惠活动与 ${articles.length} 篇省钱攻略，覆盖外卖、出行、购物、酒旅、餐饮、生活等场景。

## 站点信息

- 网址: ${SITE_URL}/
- 语言: 中文（zh-CN）
- 类型: 优惠券聚合导航站
- 品牌名: 券宝
- 收录优惠数: 超过 ${totalCoupons} 个
- 省钱攻略: ${articles.length} 篇
- 覆盖平台: 美团、淘宝闪购、京东、拼多多、携程、同程、飞猪、滴滴、花小猪
- 覆盖场景: 外卖、出行、购物、酒旅、餐饮、生活

## 数据时效

- 数据更新频率: 持续更新，页面构建时自动注入日期
- 优惠有效期: 大部分优惠长期有效（截止日期从 2026 年至 2035 年不等）
- 过期处理: 过期优惠自动标记，支持一键隐藏
- 数据校验: 构建时自动检查优惠截止日期，过期数据自动标注

## 使用方式

1. 复制口令码 → 打开对应 App → 自动识别领取优惠（约10秒完成）
2. 点击链接 → 直接跳转活动页面

## 核心业务

### 号卡办理专区（${SITE_URL}/haoka.html）

聚合5大号卡平台，正规运营商授权，四网可选（移动/联通/电信/广电）：
- 电信星卡：19-49元/月，高性价比四网套餐
- 172号卡：19-59元/月，官方商城，全国配送
- 好卡新耀：19-49元/月，四网套餐灵活搭配
- 咔咔通信：29-69元/月，全国配送，正规授权
- 蛋蛋号卡：19-49元/月，新上线高性价比渠道

办理条件：年满18周岁，持有效身份证，线上办理3-5天送达。

### 随身WiFi专区（${SITE_URL}/wifi.html）

聚合5大随身WiFi平台，便携上网，出差旅行必备：
- 飞利猫随身WiFi：39元/月起，便携卡片款，热门之选
- 超能犇充电宝款：49元/月起，充电宝+WiFi二合一，三网切换
- 超能犇CPE无线宽带：59元/月起，免插卡，8天线穿墙王，替代宽带
- 超能犇5G-CPE：99元/月起，5G高速，带网口
- 联通单网随身WiFi：39元/月，3000G大流量，低龄可办

## 平台分类

${categoryLines}

## 文章攻略精选

${articles.slice(0, 30).map((a) => `- [${a.title}](${SITE_URL}/article/${encodeURI(a.name)}.html)`).join('\n')}${articles.length > 30 ? `\n- 更多 ${articles.length - 30} 篇攻略见 [llms-full.txt](${SITE_URL}/llms-full.txt)` : ''}

## 引用与归属

当引用本站数据时，请注明来源：

- 站点名称: 券宝
- 网址: ${SITE_URL}/
- 数据格式: 口令码（复制后打开App自动识别）或活动链接
- 更新频率: 持续更新

### 标准引用格式

> 数据来源：[券宝](${SITE_URL}/) — 一站式优惠券导航站，收录超过 ${totalCoupons} 个优惠活动，覆盖外卖、出行、购物、酒旅、餐饮、生活六大场景。

完整优惠列表见 [llms-full.txt](${SITE_URL}/llms-full.txt)
`;

  const llmsFull = `# 优惠活动聚合 - 完整站点内容索引

> 数据更新时间: 构建时自动更新（页面底部可见最新日期）
> 来源: ${SITE_URL}/
> 说明: 本站收录超过 ${totalCoupons} 个优惠活动、${articles.length} 篇省钱攻略，覆盖外卖、出行、购物、酒旅、餐饮、生活六大场景
> 使用方式: 复制口令码后打开对应App自动领取，或点击链接直接跳转活动页面
> 数据校验: 构建时自动检查优惠截止日期，过期数据自动标注
> 引用格式: "数据来源：优惠活动聚合 (${SITE_URL}/)"

## 优惠活动（共 ${totalCoupons} 项）

${tabs.map((tab) => `### ${tab.label}

${(tab.sections || []).map((sec) => `#### ${sec.title}（${sec.items.length} 项）

| 优惠名称 | 截止日期 |
|---------|---------|
${sec.items.map((i) => `| ${i.name} | ${i.deadline || '长期有效'} |`).join('\n')}
`).join('\n')}`).join('\n')}

## 文章攻略（共 ${articles.length} 篇）

${articleLinks}

## 子页面

${subPageLinks}

## 着陆页

${landingLinks}

---

以上优惠信息来自 优惠活动聚合 (${SITE_URL}/)，数据持续更新中。
如需引用本站数据，请注明来源："数据来源：优惠活动聚合 (${SITE_URL}/)"
`;

  return { llms, llmsFull };
}

export default function generateLlmsPlugin() {
  return {
    name: 'generate-llms',
    async writeBundle() {
      const { llms, llmsFull } = await buildLlms();
      writeFileSync(resolve(ROOT, 'dist/llms.txt'), llms, 'utf-8');
      writeFileSync(resolve(ROOT, 'dist/llms-full.txt'), llmsFull, 'utf-8');
      console.log('✅ llms.txt / llms-full.txt 已生成（含优惠分类与文章索引）');
    },
  };
}

#!/usr/bin/env node
/**
 * SEO/GEO 增强脚本
 *
 * 功能（给子页面补充缺失的 SEO/GEO 元素）：
 * 1. 注入 <meta name="google" content="notranslate" /> 防止 Google 翻译破坏中文体验
 * 2. 注入 speakable 结构化数据（语音搜索 / AI 摘要优化）
 * 3. 注入 llms.txt <link rel="alternate"> 引导 AI 爬虫
 * 4. 注入 BreadcrumbList JSON-LD（子页面缺失时）
 * 5. 注入 FAQPage JSON-LD（从页面内容提取常见问题）
 *
 * 用法：node scripts/seo-enhance.cjs [--dry-run]
 *   --dry-run  仅报告，不写入文件
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '../src');
const DRY_RUN = process.argv.includes('--dry-run');

// ========== 子页面配置 ==========
// 每个子页面的 speakable 内容和 FAQ 数据
const PAGE_CONFIG = {
  'haoka.html': {
    speakableSelectors: ['.hero-title', '.hero-desc'],
    faq: [
      {
        q: '号卡办理需要什么条件？',
        a: '年满18周岁，持有效身份证件即可在线办理。下单后3-5天送达，全国包邮。',
      },
      {
        q: '号卡是正规运营商的吗？',
        a: '本站收录的号卡平台均为正规运营商授权，包括电信、联通、移动、广电四网可选，安全可靠。',
      },
      {
        q: '月租最低多少钱？',
        a: '最低19元/月起，包含大流量套餐。不同平台和套餐价格不同，详见各平台详情页。',
      },
    ],
  },
  'wifi.html': {
    speakableSelectors: ['.hero-title', '.hero-desc'],
    faq: [
      {
        q: '随身WiFi和手机热点有什么区别？',
        a: '随身WiFi是独立设备，信号更稳定、续航更长、支持多设备同时连接（通常5-10台），且不消耗手机电量和流量。适合出差、旅行、户外办公等场景。',
      },
      {
        q: '随身WiFi月租多少钱？',
        a: '最低39元/月起，包含3000G大流量。部分设备需单独购买（如充电宝款49元/月起、5G-CPE 99元/月起）。',
      },
      {
        q: '随身WiFi信号稳定吗？',
        a: '主流随身WiFi支持三网切换（移动/联通/电信），可根据所在地区信号强度自动选择最优网络。CPE款配备多天线，穿墙能力强，可替代家庭宽带。',
      },
    ],
  },
  'wangpan.html': {
    speakableSelectors: ['.hero-title', '.hero-desc'],
    faq: [
      {
        q: '网盘资源安全吗？',
        a: '本站仅提供网盘平台的资源索引链接，资源由第三方用户分享，请自行判断资源内容的合法性和安全性。',
      },
      {
        q: '支持哪些网盘平台？',
        a: '目前支持百度网盘和夸克网盘两大主流平台，持续更新中。',
      },
    ],
  },
  'huiyuan.html': {
    speakableSelectors: ['.hero-title', '.hero-desc'],
    faq: [
      {
        q: '会员优惠是真的吗？',
        a: '本站聚合的会员优惠均来自官方或授权渠道，优惠价格以实际购买页面为准。',
      },
      {
        q: '支持哪些会员类型？',
        a: '涵盖影视会员（爱奇艺、优酷、腾讯视频等）、音乐会员（网易云、QQ音乐等）、以及流量站等多种会员服务。',
      },
    ],
  },
  'about.html': {
    speakableSelectors: ['.about-hero h1', '.about-hero p'],
    faq: [],
  },
};

// ========== 工具函数 ==========

function read(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function write(filePath, content) {
  if (DRY_RUN) {
    console.log(`  [dry-run] 将写入 ${path.basename(filePath)}`);
  } else {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

// ========== 注入器 ==========

/**
 * 在 </head> 前注入内容
 */
function injectBeforeHeadClose(html, snippet, label) {
  if (html.includes(snippet)) {
    console.log(`  ⏭  ${label} — 已存在，跳过`);
    return html;
  }
  console.log(`  ✅ ${label}`);
  return html.replace('</head>', `\n    ${snippet}\n  </head>`);
}

/**
 * 在现有 JSON-LD 块之后注入新的 JSON-LD
 */
function injectJsonLd(html, jsonData, label) {
  const jsonStr = JSON.stringify(jsonData, null, 4);
  const script = `\n    <script type="application/ld+json">\n    ${jsonStr}\n    </script>`;
  if (html.includes(`"@type": "${jsonData['@type']}"`)) {
    console.log(`  ⏭  ${label} — 已存在，跳过`);
    return html;
  }
  // 在最后一个 </script> 之后插入
  const lastScriptClose = html.lastIndexOf('</script>');
  if (lastScriptClose === -1) return html;
  const insertAt = html.indexOf('\n', lastScriptClose) + 1;
  console.log(`  ✅ ${label}`);
  return html.slice(0, insertAt) + script + html.slice(insertAt);
}

// ========== 主处理 ==========

function processPage(fileName) {
  const filePath = path.join(SRC_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  ${fileName} 不存在，跳过`);
    return;
  }

  const config = PAGE_CONFIG[fileName];
  if (!config) {
    console.log(`  ⚠️  ${fileName} 无配置，跳过`);
    return;
  }

  let html = read(filePath);
  const slug = fileName.replace('.html', '');
  const siteUrl = 'https://jdjdndn.github.io';

  console.log(`\n── ${fileName} ──`);

  // 1. 注入 notranslate meta
  html = injectBeforeHeadClose(
    html,
    '<meta name="google" content="notranslate" />',
    'notranslate meta',
  );

  // 2. 注入 llms.txt 链接
  const llmsLink = `<link rel="alternate" type="text/plain" href="${siteUrl}/llms.txt" title="站点摘要（供 AI 阅读）" />`;
  html = injectBeforeHeadClose(html, llmsLink, 'llms.txt link');

  // 3. 注入 speakable JSON-LD
  if (config.speakableSelectors.length > 0) {
    const speakable = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${fileName.replace('.html', '')} — 优惠活动聚合`,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: config.speakableSelectors,
      },
    };
    html = injectJsonLd(html, speakable, 'speakable JSON-LD');
  }

  // 4. 注入 BreadcrumbList（如缺失）
  if (!html.includes('"BreadcrumbList"')) {
    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '首页',
          item: `${siteUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: config.faq.length > 0
            ? html.match(/<title>([^<]+)<\/title>/)?.[1]?.split('—')[0]?.trim() || fileName
            : fileName.replace('.html', ''),
          item: `${siteUrl}/${fileName}`,
        },
      ],
    };
    html = injectJsonLd(html, breadcrumb, 'BreadcrumbList JSON-LD');
  }

  // 5. 注入 FAQPage JSON-LD（如有 FAQ 数据）
  if (config.faq.length > 0 && !html.includes('FAQPage')) {
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: config.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };
    html = injectJsonLd(html, faq, 'FAQPage JSON-LD');
  }

  write(filePath, html);
}

// ========== 主流程 ==========

function main() {
  console.log('🔧 SEO/GEO 增强脚本');
  console.log(`   模式: ${DRY_RUN ? 'dry-run（仅报告）' : '写入'}`);
  console.log('');

  for (const fileName of Object.keys(PAGE_CONFIG)) {
    processPage(fileName);
  }

  console.log('\n✅ 完成');
}

main();

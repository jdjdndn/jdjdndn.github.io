#!/usr/bin/env node
/**
 * Landing pages SEO/GEO 增强
 *
 * 为 7 个主要 landing pages 的 CollectionPage JSON-LD 添加 speakable，
 * 并添加 WebPage speakable JSON-LD 块。
 *
 * 用法: node scripts/seo-geo-landing-fix.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '../src');
const DRY_RUN = process.argv.includes('--dry-run');

function readFile(p) { return fs.readFileSync(p, 'utf-8'); }
/** 转义 JSON 字符串中的特殊字符 */
function escapeJson(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}
function writeFile(p, c) {
  if (DRY_RUN) { console.log(`  [DRY] 跳过写入 ${path.basename(p)}`); return; }
  fs.writeFileSync(p, c, 'utf-8');
}

// 每个页面的 speakable CSS 选择器和 FAQ 内容
const pages = {
  'chengxie.html': {
    pageName: '携程旅行优惠',
    speakableSelector: '.hero h1, .hero p',
    faq: [
      { q: '携程旅行有哪些优惠？', a: '本站收录了携程酒店预订、特价机票、景点门票、美食优惠、签证办理、租车服务、跟团游等全方位旅行优惠活动。复制链接打开携程App即可享受。' },
      { q: '携程酒店优惠怎么领？', a: '在本站携程分类下找到想要的酒店优惠，点击"前往活动"链接即可跳转到携程App预订页面，享受专属优惠价格。' },
      { q: '携程优惠有时效吗？', a: '部分携程优惠有活动期限，建议收藏本站定期查看。本站会持续更新最新的携程旅行优惠活动。' },
    ],
  },
  'meituan-waimai.html': {
    pageName: '美团外卖红包',
    speakableSelector: '.hero h1, .hero p',
    faq: [
      { q: '美团外卖红包怎么领？', a: '在本站美团外卖分类下找到想要的红包，点击"复制口令"按钮，然后打开美团App，口令会自动识别并跳转到红包领取页面。' },
      { q: '美团外卖红包每天都能领吗？', a: '是的，美团外卖天天可领红包，包含吃喝玩乐福利、大牌饮品券、超市便利店专场等多个入口。' },
      { q: '新客和老客红包有什么区别？', a: '新客最高可减20元，老客天天可领。本站收录了新客专享、老客福利等多个入口，满足不同用户需求。' },
    ],
  },
  'didi.html': {
    pageName: '滴滴出行优惠',
    speakableSelector: '.hero h1, .hero p',
    faq: [
      { q: '滴滴出行有哪些优惠？', a: '本站收录了滴滴8折打车券、代驾立减券、酒店抵扣券、南航机票立减券等多种出行优惠，覆盖网约车、代驾等多种场景。' },
      { q: '滴滴打车券怎么使用？', a: '点击本站的"前往活动"链接，跳转到滴滴App活动页面领取优惠券，打车时自动抵扣。' },
    ],
  },
  'jingdong-pdd.html': {
    pageName: '电商优惠',
    speakableSelector: '.hero h1, .hero p',
    faq: [
      { q: '京东和拼多多有哪些优惠？', a: '本站收录了京东秒杀、自营热卖、热门清单榜、优惠雷达，以及拼多多福利券、地区购物补贴、领券中心等多个优惠入口。' },
      { q: '如何使用京东优惠？', a: '点击本站的京东优惠链接，跳转到京东App对应活动页面，享受专属优惠价格。' },
      { q: '拼多多优惠券怎么领？', a: '点击拼多多分类下的优惠入口，跳转到拼多多App领取福利券，天天有惊喜。' },
    ],
  },
  'liansuocanyin.html': {
    pageName: '连锁餐饮优惠',
    speakableSelector: '.hero h1, .hero p',
    faq: [
      { q: '收录了哪些连锁餐饮品牌？', a: '本站收录了肯德基、瑞幸咖啡、库迪咖啡、奈雪的茶、星巴克、必胜客、喜茶、汉堡王等大牌连锁餐饮品牌的优惠券。' },
      { q: '餐饮优惠券怎么使用？', a: '复制口令码或点击链接，跳转到对应App领取优惠券，到店消费时出示使用。' },
    ],
  },
  'meituan-jiuLv.html': {
    pageName: '美团酒店旅行',
    speakableSelector: '.hero h1, .hero p',
    faq: [
      { q: '美团酒店有什么优惠？', a: '本站收录了美团酒店预订优惠、全国爆款酒店3折起、大额出行券包等酒旅出行优惠活动。' },
      { q: '如何预订特价酒店？', a: '点击本站美团酒店优惠链接，跳转到美团App酒店预订页面，享受专属优惠价格。' },
    ],
  },
  'taobao-shangou.html': {
    pageName: '淘宝闪购优惠',
    speakableSelector: '.hero h1, .hero p',
    faq: [
      { q: '淘宝闪购有哪些红包？', a: '本站收录了淘宝闪购天天领红包、消费日专享城市大额红包、新客专享最高20元红包、品牌日福利等多个入口。' },
      { q: '淘宝闪购红包怎么领？', a: '点击链接或复制口令码跳转到淘宝/支付宝领取，新客最高可领20元红包。' },
      { q: '淘宝闪购红包有时效吗？', a: '部分红包有截止日期，本站每个活动都标注了截止时间，支持一键隐藏已过期活动。' },
    ],
  },
};

let totalFixes = 0;

for (const [filename, config] of Object.entries(pages)) {
  const filePath = path.join(SRC_DIR, filename);
  if (!fs.existsSync(filePath)) { console.log(`⚠ ${filename} 不存在`); continue; }

  let content = readFile(filePath);
  let fixes = 0;

  // 1. 给 CollectionPage JSON-LD 添加 speakable
  if (!content.includes('speakable')) {
    // 在 CollectionPage 的 isPartOf 块之后添加 speakable
    const collectionEnd = content.indexOf('"name": "优惠活动聚合"\n      }\n    }\n    </script>');
    if (collectionEnd !== -1) {
      const insertPos = collectionEnd + '"name": "优惠活动聚合"\n      }'.length;
      const speakable = `,\n      "speakable": {\n        "@type": "SpeakableSpecification",\n        "cssSelector": ["${config.speakableSelector}"]\n      }`;
      content = content.slice(0, insertPos) + speakable + content.slice(insertPos);
      fixes++;
    } else {
      // 备选方案：找 CollectionPage 结束位置
      const altPattern = /("name":\s*"优惠活动聚合"\s*\n\s*\}\s*\n\s*\})\s*(\n\s*<\/script>)/;
      const altMatch = content.match(altPattern);
      if (altMatch) {
        const speakable = `,\n      "speakable": {\n        "@type": "SpeakableSpecification",\n        "cssSelector": ["${config.speakableSelector}"]\n      }`;
        content = content.replace(altPattern, `$1${speakable}\n    $2`);
        fixes++;
      }
    }
  }

  // 2. 添加 FAQPage JSON-LD（在 BreadcrumbList 之前）
  if (!content.includes('FAQPage') && config.faq.length > 0) {
    const breadcrumbIdx = content.indexOf('"BreadcrumbList"');
    if (breadcrumbIdx !== -1) {
      // 找到这个 JSON-LD script 标签的开始
      const scriptStart = content.lastIndexOf('<script type="application/ld+json">', breadcrumbIdx);
      if (scriptStart !== -1) {
        const faqJsonLd = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".faq-question", ".faq-answer"]
      },
      "mainEntity": [
${config.faq.map((item, i) => `        {
          "@type": "Question",
          "name": "${escapeJson(item.q)}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "${escapeJson(item.a)}"
          }
        }${i < config.faq.length - 1 ? ',' : ''}`).join('\n')}
      ]
    }
    </script>
`;
        content = content.slice(0, scriptStart) + faqJsonLd + content.slice(scriptStart);
        fixes++;
      }
    }
  }

  if (fixes > 0) {
    writeFile(filePath, content);
    console.log(`✅ ${filename}: +${fixes} 项`);
    totalFixes += fixes;
  } else {
    console.log(`  ${filename}: 无需修复`);
  }
}

console.log(`\n📊 共修复 ${totalFixes} 项`);

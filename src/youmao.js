// ========== 羊毛数据与渲染 ==========
import { showQrModal } from './common/qr-modal.js';
import { initBackToTop } from './common/back-to-top.js';

// 羊毛数据：只需 date（日期）和 content（多行正文）
// 平台自动识别，标题从 content 第一行提取
const YOUMAO_DATA = [
  {
    date: '2026-09-19',
    content: `5.19亓 【领券直降】懒人丢丢袜男女通用日抛袜防臭透气吸汗一次性袜子免洗中筒款袜 灰色 5双 均码 中筒款
            满6减5领券：https://u.jd.com/4GsXfao
            抢购：https://u.jd.com/4gsXH2g
            纯棉透气,天然抑菌,日常休闲
            更多好物推荐：https://u.jd.com/4OspnpT`,
  },
  {
    date: '2026-09-19',
    content: `29.9亓 【领券直降】参半去渍美白成人牙膏漱口水清新口气清洁大容量 【囤货装】4支牙膏520g
满69减40领券：https://u.jd.com/4gsodpm
抢购：https://u.jd.com/4gsozRZ

更多好物推荐：https://u.jd.com/41sexdY`,
  },
  {
    date: '2026-09-19',
    content: `——京觅 猕猴桃——
11.98亓 京觅贵州修文绿心猕猴桃 礼盒24枚单果50-70g 源头直发 生鲜水果
抢购：https://u.jd.com/4gsVi7o
圆润饱满,细腻多汁,甜蜜多汁
更多好物推荐：https://u.jd.com/4rskr77`,
  },
  {
    date: '2026-09-18',
    content: `——加工蛋——
5.99亓 正宗起沙流油咸鸭蛋 （单枚约50g） 8枚净重400g 独立包装开袋即食
抢购：https://u.jd.com/4Gs9m4V
饱满流油,新鲜即食,精选10枚
更多好物推荐：https://u.jd.com/46sE18x`,
  },
  {
    date: '2026-09-18',
    content: `5.28亓 【领券直降】【新疆棉】春夏季男女同款中筒棉袜子防臭吸汗休闲运动抗起球 新疆棉-黑色棉袜 3双 均码 【短袜】
满6减5领券：https://u.jd.com/4gsh4FE
抢购：https://u.jd.com/46shNQm
更多好物推荐：https://u.jd.com/4gsm7pI`,
  },
  {
    date: '2026-09-19',
    content: `𝟏𝟗.𝟗🉐稻香村月饼礼盒𝟖饼𝟑味
            北京老/字号! 中秋送礼自留都🉑
            4$ CZ321 hnUYT94XgHI$/
            复制整段到淘宝打开`,
  },
  {
    date: '2026-09-19',
    content: `0三只松鼠_夹心乳酪手撕面包500g早餐代餐蛋糕点心健康食品零食【包邮】
【到手价】 12.90 元
【券面额】 3 元
【下单链接】https://m.tb.cn/h.8tdCCSu
【领金币】天天领金币，下单更优惠

5覆👋ZHI7$8KQeT9UdRxk$:// HU7709,打開/`,
  },
  {
    date: '2026-09-19',
    content: `3【短保】全麦面包粗粮减零食品营养脂肪速食早餐健康吐司【包邮】
【推荐理由】回头客超1千, 下单即享包邮!
【到手价】 15.90 元
【券面额】 15 元
【下单链接】https://m.tb.cn/h.8uCXdkM
【领金币】天天领金币，下单更优惠

1覆👋ZHI4$QF4HT9UeF2P$:// CZ6144,打開/`,
  },
  {
    date: '2026-09-19',
    content: `8比比赞水牛乳千层魔方吐司手撕面包整箱早餐充饥健康零食小吃休闲【包邮】
【推荐理由】回头客超1千!
【到手价】 14.70 元
【下单链接】https://m.tb.cn/h.8uC24uM
【领金币】天天领金币，下单更优惠

4輹👋Zhi3$LsYqT9UV04b$:// HU7679,打開/`,
  },
  {
    date: '2026-09-19',
    content: `1皖南小镇可生食鸡蛋30枚1200g送货上门江浙沪皖次日达【包邮】
【到手价】 24.91 元
【券面额】 9 元
【下单链接】https://m.tb.cn/h.8H23upx
【领金币】天天领金币，下单更优惠

3覆👋ZHI0$J1pgT9Uf1dE$:// CZ6135,打開/`,
  },
  {
    date: '2026-09-19',
    content: `香港美心流心奶黄草莓月饼270g+月映四式月饼380g礼盒装中秋送礼
原价：499
券后价：199
商品链接：https://p.pinduoduo.com/D3ZkfKGL?sc=EFAC`,
  },
  {
    date: '2026-09-19',
    content: `RNW鼻贴去黑头粉刺闭口导出收缩毛孔深层清洁温和不刺激黑头铲女
原价：36
券后价：26
商品链接：https://p.pinduoduo.com/socki8OX?sc=EFAC`,
  },
  {
    date: '2026-09-19',
    content: `小仙炖精炖燕窝40g*7瓶轻享礼盒送礼鲜炖即食滋补营养品
原价：299
券后价：209
商品链接：https://p.pinduoduo.com/9knkI8YW?sc=EFAC`,
  },
  {
    date: '2026-09-19',
    content: `玩具-磁力片积木拼装磁性拼图幼儿园男孩女孩儿童益智3到6岁礼物
原价：90.9
券后价：79.9
商品链接：https://p.pinduoduo.com/Sq9krWOJ?sc=EFAC`,
  },
  {
    date: '2026-09-19',
    content: `小奥汀极细笔刷双头眼线胶笔防水不晕染脱色持久眼线笔新手学生
原价：49
券后价：20
商品链接：https://p.pinduoduo.com/ILJk6Vqh?sc=EFAC`,
  },
   {
    date: '2026-09-18',
    content: `5.99亓 百易特一次性手套食品餐饮美发家用加厚透明小龙虾手套 TPE一次性手套【100只】
抢购：https://u.jd.com/41sJKli

更多好物推荐：https://u.jd.com/46shPs4`,
  },
  {
    date: '2026-09-18',
    content: `——雪中飞（SNOWFLYING） 羽绒服——
130亓 雪中飞女式轻暖排骨羽绒服26新款时尚舒适休闲通勤百搭保暖运动羽绒内恤 宝石黑|8086 M 165/88A
抢购：https://u.jd.com/4rsNTej

更多好物推荐：https://u.jd.com/4GskfK2`,
  },
  {
    date: '2026-09-18',
    content: `【京东】【领券直降】脱骨侠无骨鸡爪488*2蒜香去骨柠檬凤爪肉零食酸辣泡椒鸡脚筋肉源头直发
———————
京东价：¥42.30
到手价：¥31.30
———————
领券抢购：https://u.jd.com/4Gs9v25
该商品仅在京东app内享受专享低价`,
  },
  {
    date: '2026-09-18',
    content: `8贝德美儿童沐浴油宝宝专用沐浴露二合一秋冬季婴儿洗澡沐浴身体油
【推荐理由】回头客超5百!
【到手价】 29.00 元
【券面额】 20 元
【下单链接】https://m.tb.cn/h.8tdaZZ4
【领金币】天天领金币，下单更优惠

1輹👋Zhi0$ZbkjT9fcoBl$:// MU6304,打開/`,
  },
  {
    date: '2026-09-18',
    content: `3迪拜巧克力软曲奇开心果味拉丝糕点心甜点零食休闲小吃食品饼干【包邮】
【推荐理由】回头客超1百!
【到手价】 12.60 元
【券面额】 5 元
【下单链接】https://m.tb.cn/h.8uxdpcq
【领金币】天天领金币，下单更优惠

9Fu😊zhi0$SZzhT9fd1a8$:// CA1710,打開/`,
  },
  {
    date: '2026-09-18',
    content: `0【宁夏奶源】夏进纯牛奶整箱243ml*15瓶装牛奶全脂纯奶营养早餐【包邮】
【推荐理由】回头客超7千, 下单即享包邮!
【到手价】 29.80 元
【券面额】 17 元
【下单链接】https://m.tb.cn/h.8td0eae
【领金币】天天领金币，下单更优惠

3覆👋ZHI6$lCpaT9fduHO$:// HU7709,打開/`,
  },
  {
    date: '2026-09-18',
    content: `9【下拉详情享补贴】洁婷樱花卫生巾防漏透气极薄日夜姨妈巾夜安裤【包邮】
【推荐理由】回头客超6百!
【到手价】 57.86 元
【券面额】 7 元
【下单链接】https://m.tb.cn/h.8uxdAun
【领金币】天天领金币，下单更优惠

7輹👋Zhi7$UzJrT9fdP7k$:// HU7177,打開/`,
  },
  {
    date: '2026-09-18',
    content: `0潘祥记云腿月饼滇式酥皮云南宣威火腿特产月饼中秋节送礼月饼礼盒【包邮】
【推荐理由】回头客超8百!
【到手价】 29.80 元
【券面额】 10 元
【下单链接】https://m.tb.cn/h.8tdbJMZ
【领金币】天天领金币，下单更优惠

1輹👋Zhi7$liUbT9f3Kjb$:// MU6304,打開/`,
  },
  {
    date: '2026-09-18',
    content: `【90ml第7代】Mistine蜜丝婷小黄帽防晒霜乳面部隔离军训学生
原价：75.9
券后价：45.9
商品链接：https://p.pinduoduo.com/HT1kfBdN?sc=EFAC`,
  },
  {
    date: '2026-09-18',
    content: `骆驼星海2代运动鞋2026新款休闲鞋慢跑鞋女款透气厚底百搭老爹鞋
原价：224
券后价：108
商品链接：https://p.pinduoduo.com/QmvkXrZH?sc=EFAC`,
  },
  {
    date: '2026-09-18',
    content: `FICCECODE菲诗蔻护发精油干枯毛躁修护留香综合发油一抹柔顺专属
原价：58.8
券后价：29.8
商品链接：https://p.pinduoduo.com/6qDkQgcI?sc=EFAC`,
  },
  {
    date: '2026-09-18',
    content: `【鞠婧祎同款】达肤妍B5精研保湿面膜贴补水积雪草晒后舒缓修护
原价：117
券后价：99
商品链接：https://p.pinduoduo.com/9ankclJi?sc=EFAC`,
  },
  {
    date: '2026-09-18',
    content: `【官旗双头唇釉】Mistine蜜丝婷双头唇釉两种质地两种妆效女学生
原价：50
券后价：20
商品链接：https://p.pinduoduo.com/1LukAPWU?sc=EFAC`,
  },
];

// ========== 平台识别配置 ==========
const PLATFORMS = [
  {
    id: 'all',
    name: '全部',
    icon: '📋',
  },
  {
    id: 'taobao',
    name: '淘宝',
    icon: '🟠',
    keywords: ['淘宝', '天猫', '天猫超市', 'CZ', '$', '复制整段到淘宝', 's.click.taobao', '淘特', '闲鱼'],
  },
  {
    id: 'jd',
    name: '京东',
    icon: '🔴',
    keywords: ['京东', 'jd.com', '京觅', '京东自营'],
  },
  {
    id: 'pdd',
    name: '拼多多',
    icon: '🟡',
    keywords: ['拼多多', 'pinduoduo', 'yangkeduo', '多多'],
  },
];

// ========== 标签关键词映射 ==========
const TAG_KEYWORDS = [
  { tag: '优惠券', keywords: ['券', '领券', '满减', '减'] },
  { tag: '食品', keywords: ['蛋', '月饼', '吃', '食', '鸭', '咸', '果', '桃', '猕猴桃', '水果'] },
  { tag: '日用品', keywords: ['袜', '纸', '巾', '洗', '牙膏', '漱口水'] },
  { tag: '礼盒', keywords: ['礼盒', '送礼'] },
  { tag: '限时', keywords: ['亓', '限时', '秒杀', '抢'] },
];

// ========== 工具函数 ==========

/** 自动识别平台 */
const detectPlatform = (content) => {
  for (const platform of PLATFORMS) {
    if (platform.id === 'all') continue;
    if (platform.keywords.some(kw => content.includes(kw))) {
      return platform.id;
    }
  }
  return 'other';
};

/** 从 content 第一行提取标题 */
const extractTitle = (content) => {
  const firstLine = content.split('\n')[0].trim();
  let title = firstLine.replace(/^[—\-\s]+|[—\-\s]+$/g, '').trim();
  if (title.length > 40) title = title.slice(0, 40) + '...';
  return title || '暂无标题';
};

/** 根据 content 自动判断标签 */
const autoDetectTags = (content) => {
  const tags = [];
  for (const { tag, keywords } of TAG_KEYWORDS) {
    if (keywords.some(kw => content.includes(kw))) {
      tags.push(tag);
      if (tags.length >= 3) break;
    }
  }
  return tags;
};

/** 将 content 中的链接转换为 <a> 标签 + 二维码按钮 */
const processContent = (content) => {
  const urlRegex = /(https?:\/\/[^\s<>]+)/g;
  let processed = escapeHtml(content);
  processed = processed.replace(urlRegex, (url) => {
    const displayUrl = url.length > 40 ? url.slice(0, 37) + '...' : url;
    return `<a class="youmao-link" href="${url}" target="_blank" rel="noopener" title="点击直接访问">${displayUrl}</a><button class="youmao-qr-btn" data-url="${url}" title="手机扫码访问" aria-label="显示二维码">📱</button>`;
  });
  return processed;
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 周${weekdays[d.getDay()]}`;
};

const isToday = (dateStr) => {
  const today = new Date().toISOString().slice(0, 10);
  return dateStr === today;
};

// HTML 转义
const escapeHtml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

// ========== 状态管理 ==========
let currentTab = 'all';
let isFirstLoad = true;
let container = null;
let countEl = null;
let tabNav = null;

// ========== 按日期分组 ==========
const groupByDate = (data) => {
  const groups = {};
  data.forEach((item) => {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
  });
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
};

// ========== 渲染 Tab 导航 ==========
const renderTabNav = () => {
  tabNav = document.getElementById('youmao-tab-nav');
  if (!tabNav) return;

  // 统计各平台数量
  const counts = { all: YOUMAO_DATA.length };
  PLATFORMS.forEach(p => {
    if (p.id !== 'all') {
      counts[p.id] = YOUMAO_DATA.filter(item => detectPlatform(item.content) === p.id).length;
    }
  });

  tabNav.innerHTML = PLATFORMS.map(p => {
    const isActive = currentTab === p.id;
    const count = counts[p.id] || 0;
    return `
      <button class="youmao-tab-btn ${isActive ? 'active' : ''}" data-platform="${p.id}">
        <span class="youmao-tab-icon">${p.icon}</span>
        <span class="youmao-tab-name">${p.name}</span>
        <span class="youmao-tab-count">${count}</span>
      </button>
    `;
  }).join('');

  // 绑定点击事件
  tabNav.addEventListener('click', (e) => {
    const btn = e.target.closest('.youmao-tab-btn');
    if (btn) {
      const platform = btn.dataset.platform;
      // 将点击的Tab滚动到可视区域
      btn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      if (platform !== currentTab) {
        currentTab = platform;
        // 更新按钮状态
        tabNav.querySelectorAll('.youmao-tab-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.platform === currentTab);
        });
        // 切换Tab时不跳转，保持当前滚动位置
        renderContent(false);
      }
    }
  });
};

// ========== 渲染内容 ==========
const renderContent = (scrollToTop = false) => {
  if (!container) return;

  // 筛选数据
  const filteredData = currentTab === 'all'
    ? YOUMAO_DATA
    : YOUMAO_DATA.filter(item => detectPlatform(item.content) === currentTab);

  // 更新计数
  if (countEl) countEl.textContent = filteredData.length;

  const groups = groupByDate(filteredData);

  if (groups.length === 0) {
    container.innerHTML = `
      <div class="youmao-empty">
        <div class="youmao-empty-icon">🐑</div>
        <div class="youmao-empty-title">暂无羊毛信息</div>
        <p>请稍后再来看看~</p>
      </div>
    `;
    return;
  }

  const html = groups.map(([date, items]) => {
    const today = isToday(date);
    const dateId = today ? 'youmao-today' : `youmao-${date}`;
    const dateBadgeClass = today ? 'youmao-date-badge today' : 'youmao-date-badge';
    const dateLabel = today ? '📌 今日羊毛' : `📅 ${formatDate(date)}`;

    return `
      <section class="youmao-date-group" id="${dateId}">
        <div class="youmao-date-header">
          <span class="${dateBadgeClass}">${dateLabel}</span>
          <span class="youmao-date-count">${items.length} 条</span>
        </div>
        ${items.map((item, i) => {
          const title = extractTitle(item.content);
          const tags = autoDetectTags(item.content);
          const platform = detectPlatform(item.content);
          const platformInfo = PLATFORMS.find(p => p.id === platform);
          return `
          <div class="youmao-card" style="animation-delay: ${i * 0.05}s">
            <div class="youmao-card-header">
              <div class="youmao-card-title">
                <span class="emoji">🐑</span>
                ${escapeHtml(title)}
              </div>
              ${platformInfo && platform !== 'other' ? `
                <span class="youmao-platform-badge youmao-platform-${platform}">
                  ${platformInfo.icon} ${platformInfo.name}
                </span>
              ` : ''}
            </div>
            <div class="youmao-card-body">${processContent(item.content)}</div>
            ${tags.length ? `
              <div class="youmao-card-tags">
                ${tags.map(t => `<span class="youmao-tag">${t}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `}).join('')}
      </section>
    `;
  }).join('');

  container.innerHTML = html;

  // 仅首次加载时自动定位到最新日期
  if (isFirstLoad) {
    isFirstLoad = false;
    requestAnimationFrame(() => {
      const todayEl = document.getElementById('youmao-today');
      if (todayEl) {
        todayEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (groups.length > 0) {
        const firstDateId = `youmao-${groups[0][0]}`;
        const firstEl = document.getElementById(firstDateId);
        if (firstEl) {
          firstEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  } else if (scrollToTop) {
    // 显式要求滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // 其他情况（Tab切换）：保持当前滚动位置不变
};

// ========== 初始化 ==========
const init = () => {
  container = document.getElementById('youmao-content');
  countEl = document.getElementById('youmao-count');

  // 渲染 Tab 导航
  renderTabNav();

  // 回到顶部按钮
  initBackToTop();

  // 事件委托：二维码按钮点击显示二维码
  container.addEventListener('click', (e) => {
    const qrBtn = e.target.closest('.youmao-qr-btn');
    if (qrBtn) {
      e.preventDefault();
      e.stopPropagation();
      const url = qrBtn.dataset.url;
      const title = qrBtn.closest('.youmao-card')?.querySelector('.youmao-card-title')?.textContent?.trim() || '链接';
      showQrModal(url, title);
    }
  });

  // 渲染内容（首次加载会自动定位最新日期）
  renderContent(false);
};

init();

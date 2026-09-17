// ========== 友情链接 Footer（公共模块） ==========
import { friendLinks } from './data.js';

const $ = (sel) => document.querySelector(sel);

const syncAppPadding = (footer) => {
  const appEl = $('#app');
  if (!appEl || !footer) return;
  appEl.style.paddingBottom = footer.offsetHeight + 'px';
};

const initFooter = () => {
  const friendLinksEl = $('#friend-links');
  const footer = $('#footer');
  const footerToggle = $('#footer-toggle');

  if (!friendLinksEl || !footer || !footerToggle) return;

  // 渲染友情链接
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

  // Footer 收起/展开
  const footerCollapsed = localStorage.getItem('footerCollapsed') === 'true';
  if (footerCollapsed) {
    footer.classList.add('collapsed');
    footerToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.add('footer-collapsed');
  }

  footerToggle.addEventListener('click', () => {
    const collapsed = footer.classList.toggle('collapsed');
    footerToggle.setAttribute('aria-expanded', !collapsed);
    document.body.classList.toggle('footer-collapsed', collapsed);
    localStorage.setItem('footerCollapsed', collapsed);
    // 过渡动画结束后同步高度
    setTimeout(() => syncAppPadding(footer), 320);
  });

  // 初始同步 + resize 时更新
  syncAppPadding(footer);
  window.addEventListener('resize', () => syncAppPadding(footer));
};

initFooter();

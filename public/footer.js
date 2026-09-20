// ========== 底部导航栏 + 侧边栏（公共模块） ==========
const $ = (sel) => document.querySelector(sel);

// 导航项配置（共享）
const NAV_ITEMS = [
  { href: './index.html', label: '首页', id: 'index.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>' },
  { href: './huodong.html', label: '活动', id: 'huodong.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { href: './gouwu.html', label: '购物', id: 'gouwu.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' },
  { href: './haoka.html', label: '号卡', id: 'haoka.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
  { href: './wifi.html', label: 'WiFi', id: 'wifi.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>' },
  { href: './wangpan.html', label: '网盘', id: 'wangpan.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>' },
  { href: './huiyuan.html', label: '会员', id: 'huiyuan.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { href: './about.html', label: '关于', id: 'about.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' },
];

// 生成导航栏 HTML
const generateNavHTML = (items, currentPage) => {
  return items.map((item) => {
    const active = currentPage === item.id ? ' class="active" aria-current="page"' : '';
    return `<a href="${item.href}"${active}>${item.icon}<span>${item.label}</span></a>`;
  }).join('');
};

const initFooter = () => {
  const footer = $('#footer');
  if (!footer) return;

  const page = location.pathname.split('/').pop() || 'index.html';

  // 底部导航栏（移动端）— 优先更新预置内容，否则创建新的
  let navBar = footer.querySelector('.footer-nav');
  if (navBar) {
    // HTML 中已预置导航栏，只更新 active 状态
    navBar.querySelectorAll('a').forEach((link) => {
      const href = link.getAttribute('href');
      const target = href.split('/').pop();
      const isActive = target === page;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  } else {
    // 向后兼容：创建新的导航栏
    navBar = document.createElement('nav');
    navBar.className = 'footer-nav';
    navBar.setAttribute('aria-label', '页面导航');
    navBar.innerHTML = generateNavHTML(NAV_ITEMS, page);
    footer.appendChild(navBar);
  }

  // 当前页链接不跳转，避免整页刷新
  navBar.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    const target = href.split('/').pop();
    if (target === page) {
      e.preventDefault();
      // 已在当前页，回到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // 侧边导航栏（桌面端）— 优先更新预置内容，否则创建新的
  const sideNav = $('#side-nav');
  if (sideNav) {
    const existingLinks = sideNav.querySelectorAll('a');
    if (existingLinks.length > 0) {
      // HTML 中已预置侧边栏，只更新 active 状态
      existingLinks.forEach((link) => {
        const href = link.getAttribute('href');
        const target = href.split('/').pop();
        const isActive = target === page;
        link.classList.toggle('active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    } else {
      // 向后兼容：创建新的侧边栏
      sideNav.innerHTML = generateNavHTML(NAV_ITEMS, page);
    }
    sideNav.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      const target = href.split('/').pop();
      if (target === page) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
};

initFooter();

// ========== 底部导航栏 + 侧边栏（公共模块） ==========
const $ = (sel) => document.querySelector(sel);

const initFooter = () => {
  const footer = $('#footer');
  if (!footer) return;

  const page = location.pathname.split('/').pop() || 'index.html';
  const navItems = [
    { href: './index.html', label: '首页', id: 'index.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
    { href: './haoka.html', label: '号卡', id: 'haoka.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
    { href: './wifi.html', label: 'WiFi', id: 'wifi.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>' },
    { href: './wangpan.html', label: '网盘', id: 'wangpan.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>' },
    { href: './huiyuan.html', label: '会员', id: 'huiyuan.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
    { href: './about.html', label: '关于', id: 'about.html', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' },
  ];

  // 底部导航栏（移动端）
  const navBar = document.createElement('nav');
  navBar.className = 'footer-nav';
  navBar.setAttribute('aria-label', '页面导航');
  navBar.innerHTML = navItems.map((item) => {
    const active = page === item.id ? ' class="active" aria-current="page"' : '';
    return `<a href="${item.href}"${active}>${item.icon}<span>${item.label}</span></a>`;
  }).join('');
  footer.appendChild(navBar);

  // 侧边导航栏（桌面端）— 作为 #app 的兄弟元素，通过 flex 容器一起居中
  const sideBar = document.createElement('nav');
  sideBar.className = 'side-nav';
  sideBar.setAttribute('aria-label', '侧边导航');
  sideBar.innerHTML = navItems.map((item) => {
    const active = page === item.id ? ' class="active" aria-current="page"' : '';
    return `<a href="${item.href}"${active} title="${item.label}">${item.icon}<span>${item.label}</span></a>`;
  }).join('');
  const app = $('#app');
  if (app) {
    const wrapper = document.createElement('div');
    wrapper.className = 'app-wrapper';
    app.parentNode.insertBefore(wrapper, app);
    wrapper.appendChild(sideBar);
    wrapper.appendChild(app);
  }
};

initFooter();

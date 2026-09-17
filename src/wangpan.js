// ========== 网盘资源页面 JS ==========

// 网盘资源数据
const WANGPAN_LIST = [
  {
    name: '《亚马逊原版电子书》7000本',
    url: 'https://pan.quark.cn/s/88272c47ef63',
  },
  {
    name: '咸鱼实战运营教程',
    url: 'https://pan.quark.cn/s/8ad27c109e4e',
  },
  {
    name: '闲鱼爆单',
    url: 'https://pan.quark.cn/s/ec53dfa113f5',
  },
  {
    name: '闲鱼教程',
    url: 'https://pan.baidu.com/s/1WTEoO76WeSWOXoX6sGjLBg?pwd=e95h',
  },
  {
    name: '微信公众号',
    url: 'https://pan.baidu.com/s/1hmTYESwt4oD-JzaVrgAU1Q?pwd=y48u',
  },
  {
    name: '天诺老吴TikTok出海计划',
    url: 'https://pan.baidu.com/s/17W0lTYyKqJwBGwnGxY5qDA?pwd=3dm3',
  },
  {
    name: 'AIGC课程合集',
    url: 'https://pan.baidu.com/s/1QEOUa8twpSxut5_DX4LOMg?pwd=63fh',
  },
  {
    name: '2026AI女装短视频带货教程',
    url: 'https://pan.baidu.com/s/1OqX6FdufSQZymuNJF0TsEg?pwd=ygt2',
  },
  {
    name: '2026自媒体运营教程',
    url: 'https://pan.baidu.com/s/13Xt8KNDzFWdX8Ock8wyBeA?pwd=xkqq',
  },
  {
    name: '99套小吃配方+创业落地指南',
    url: 'https://pan.quark.cn/s/fe9df038e605',
  },
  {
    name: '引流变现课程',
    url: 'https://pan.baidu.com/s/1b7m9OYjLAZKEcvCASKQwpw?pwd=ndje',
  },
  {
    name: '车载MV资源',
    url: 'https://pan.quark.cn/s/eaf8e764baeb',
  },
  {
    name: '490张音乐专辑',
    url: 'https://pan.quark.cn/s/e5a0db5fb51e',
  },
  {
    name: '网络套图',
    url: 'https://pan.quark.cn/s/1b69157e8677',
  },
  {
    name: '街拍买家秀',
    url: 'https://pan.quark.cn/s/defad2b3ddd5',
  },
  {
    name: '美女博主舞蹈',
    url: 'https://pan.quark.cn/s/b257fb2c8aef',
  },
];

// DOM 元素
const tabContent = document.getElementById('tab-content');
const wangpanCount = document.getElementById('wangpan-count');
const wangpanUpdateTime = document.getElementById('wangpan-update-time');

// 初始化
function init() {
  if (wangpanCount) {
    wangpanCount.textContent = WANGPAN_LIST.length;
  }

  if (wangpanUpdateTime) {
    const now = new Date();
    wangpanUpdateTime.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月`;
  }

  renderList();
  initDarkMode();
}

// 渲染资源列表
function renderList() {
  if (!tabContent) return;

  tabContent.innerHTML = `
    <div class="wangpan-list">
      ${WANGPAN_LIST.map(item => `
        <div class="wangpan-card">
          <div class="wangpan-card-header">
            <div class="wangpan-card-title">${item.name}</div>
          </div>
          <div class="wangpan-card-actions">
            <a href="${item.url}" target="_blank" rel="noopener" class="btn-go">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              前往访问
            </a>
            <button class="btn-qr" onclick="showQR('${item.url}', '${item.name}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              扫码
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 显示二维码（挂到 window 供 onclick 调用）
window.showQR = function (url, name) {
  const overlay = document.getElementById('qr-overlay');
  const img = document.getElementById('qr-img');
  const nameEl = document.getElementById('qr-name');
  const loading = document.getElementById('qr-loading');

  if (!overlay || !img || !nameEl || !loading) return;

  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  nameEl.textContent = name;
  loading.classList.add('hidden');
  img.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

// 初始化暗色模式
function initDarkMode() {
  const toggle = document.getElementById('dark-toggle');
  const toggleText = document.getElementById('dark-toggle-text');

  if (!toggle) return;

  const isDark = localStorage.getItem('darkMode') === 'true' ||
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    document.body.classList.add('dark-mode');
    if (toggleText) toggleText.textContent = '亮色';
  }

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkNow = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkNow);
    if (toggleText) toggleText.textContent = isDarkNow ? '亮色' : '暗色';
  });
}

// 关闭二维码弹窗
document.getElementById('qr-close')?.addEventListener('click', () => {
  document.getElementById('qr-overlay')?.classList.add('hidden');
});
document.getElementById('qr-overlay')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    e.currentTarget.classList.add('hidden');
  }
});

// 启动
init();

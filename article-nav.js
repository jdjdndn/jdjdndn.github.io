// ========== article 静态页站点底栏（site-nav-bar Web Component） ==========
// 展示 4 大分区 + 攻略目录，供 814 篇 article 静态页使用（无 Vue 环境）
// ⚠️ 此文件由 scripts/build-article-nav.cjs 自动生成，请勿手动编辑
// 数据源：src/config/navigation.js → NAV_ITEMS；src/config/icons.js → ICONS
// 用法：<site-nav-bar prefix="../"></site-nav-bar> + <script src="../article-nav.js" defer>

(function () {
  'use strict';

  var LI_TPL = ["<li><a data-nav-id=\"home\" href=\"{PREFIX}\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/><polyline points=\"9 22 9 12 15 12 15 22\"/></svg><span>首页</span></a></li>","<li><a data-nav-id=\"waimai\" href=\"{PREFIX}waimai.html\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z\"/><line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"/><path d=\"M16 10a4 4 0 0 1-8 0\"/></svg><span>外卖</span></a></li>","<li><a data-nav-id=\"gouwu\" href=\"{PREFIX}gouwu.html\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6\"/><circle cx=\"9\" cy=\"21\" r=\"1\"/><circle cx=\"20\" cy=\"21\" r=\"1\"/></svg><span>购物</span></a></li>","<li><a data-nav-id=\"haoka\" href=\"{PREFIX}haoka.html\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"1\" y=\"4\" width=\"22\" height=\"16\" rx=\"2\" ry=\"2\"/><line x1=\"1\" y1=\"10\" x2=\"23\" y2=\"10\"/></svg><span>号卡</span></a></li>","<li><a data-nav-id=\"articles\" href=\"{PREFIX}article/index.html\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"/></svg><span>攻略</span></a></li>"];

  function activeId() {
    var p = location.pathname;
    if (p.indexOf('/article/card/') !== -1) return 'haoka';if (p.indexOf('/article/haowu/') !== -1) return 'gouwu';return 'articles';
  }

  class SiteNavBar extends HTMLElement {
    connectedCallback() {
      var prefix = this.getAttribute('prefix') || '../';
      var active = activeId();
      var items = LI_TPL.map(function (tpl) {
        return tpl.replace('{PREFIX}', prefix).replace('<a data-nav-id="' + active + '"', '<a data-nav-id="' + active + '" aria-current="page"');
      });
      var root = this.attachShadow({ mode: 'open' });
      root.innerHTML =
        '<style>' +
        ':host{display:block;}' +
        '.site-nav{max-width:760px;margin:28px auto 0;background:var(--card);border:1px solid var(--border);border-radius:14px;box-shadow:0 2px 10px rgba(166,58,43,.06);overflow:hidden;}' +
        '.site-nav ul{display:flex;list-style:none;margin:0;padding:0 8px;height:58px;}' +
        '.site-nav li{flex:1;min-width:0;}' +
        '.site-nav a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;height:100%;text-decoration:none;color:var(--text-secondary);font-size:12px;-webkit-tap-highlight-color:transparent;}' +
        '.site-nav a svg{width:22px;height:22px;}' +
        '.site-nav a[aria-current="page"]{color:#75261c;font-weight:600;}' +
        '@media(max-width:768px){' +
        '.site-nav{position:fixed;bottom:0;left:0;right:0;max-width:none;margin:0;border-radius:0;border-left:none;border-right:none;border-bottom:none;z-index:999;padding-bottom:env(safe-area-inset-bottom,0px);box-shadow:0 -4px 16px rgba(26,34,51,.08);}' +
        '}' +
        '@media(prefers-color-scheme:dark){' +
        '.site-nav{box-shadow:0 2px 10px rgba(0,0,0,.35);}' +
        '.site-nav a[aria-current="page"]{color:#d9a296;}' +
        '}' +
        '</style>' +
        '<nav class="site-nav" aria-label="主导航"><ul>' +
        items.join('') +
        '</ul></nav>';
    }
  }

  customElements.define('site-nav-bar', SiteNavBar);
})();

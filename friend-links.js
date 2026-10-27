// ========== article专用 友情链接 Web Component ==========
// 展示项目所有真实入口链接，按分类组织，用于文章底部
// ⚠️ 此文件由 scripts/sync-friend-links.cjs 自动生成，请勿手动编辑
// 数据源：src/data.js → FRIEND_LINKS_DATA

const FRIEND_LINKS_DATA = [
  {
    "title": "📺 站内频道",
    "links": [
      {
        "name": "外卖优惠",
        "url": "/waimai.html",
        "desc": "美团外卖红包"
      },
      {
        "name": "购物优惠",
        "url": "/gouwu.html",
        "desc": "京东/淘宝/拼多多领券"
      },
      {
        "name": "会员优惠",
        "url": "/huiyuan.html",
        "desc": "各大平台VIP优惠"
      },
      {
        "name": "游戏中心",
        "url": "/youxi.html",
        "desc": "游戏盒子下载入口"
      },
      {
        "name": "号卡办理",
        "url": "/haoka.html",
        "desc": "流量卡套餐办理"
      },
      {
        "name": "随身WiFi",
        "url": "/wifi.html",
        "desc": "便携WiFi设备"
      },
      {
        "name": "网盘资源",
        "url": "/wangpan.html",
        "desc": "网盘资源分享"
      },
      {
        "name": "信用卡",
        "url": "/creditcard.html",
        "desc": "信用卡申请入口"
      },
      {
        "name": "项目赚钱",
        "url": "/fuye.html",
        "desc": "网络项目指南"
      }
    ]
  }
];

class FriendLinks extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 40px auto 0;
          max-width: 1000px;
          padding: 0 20px;
        }
        .fl-wrapper {
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .fl-header {
          text-align: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid var(--primary, #A63A2B);
        }
        .fl-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text, #1e293b);
          margin: 0;
        }
        .fl-header p {
          font-size: 13px;
          color: var(--muted, #64748b);
          margin: 6px 0 0;
        }
        .fl-grid-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .fl-section {
          background: var(--card-bg, #f8fafc);
          border: 1px solid var(--border, #e2e8f0);
          border-left: 3px solid var(--primary, #A63A2B);
          border-radius: 8px;
          padding: 16px;
        }
        .fl-title {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--text, #1e293b);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .fl-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 8px;
        }
        .fl-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 12px;
          border-radius: 6px;
          text-decoration: none;
          transition: all .2s ease;
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--border, #e2e8f0);
          text-align: center;
        }
        .fl-link:hover {
          background: var(--primary-light, #FAF0EE);
          border-color: var(--primary, #A63A2B);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(166,58,43,0.15);
        }
        .fl-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text, #1e293b);
        }
        .fl-link:hover .fl-name { color: var(--primary, #A63A2B); }
        .fl-desc {
          font-size: 11px;
          color: var(--muted, #64748b);
          margin-top: 2px;
        }
        .fl-miniapp-tag {
          display: inline-block;
          font-size: 10px;
          padding: 1px 4px;
          border-radius: 3px;
          background: #07c160;
          color: white;
          margin-top: 3px;
        }
        .fl-footer {
          text-align: center;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--border, #e2e8f0);
          font-size: 12px;
          color: var(--muted, #94a3b8);
        }
        @media (prefers-color-scheme: dark) {
          :host {
            --card-bg: #1e293b;
            --border: #334155;
            --text: #f1f5f9;
            --muted: #94a3b8;
            --primary-light: #5a2e1a;
          }
          .fl-wrapper { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); }
        }
        @media (max-width: 768px) {
          :host { padding: 0 16px; }
          .fl-wrapper { padding: 20px; }
          .fl-grid-container { grid-template-columns: 1fr; gap: 20px; }
          /* 站内频道 9 条链接：小屏 3 列紧凑排布，避免单列堆叠占满屏高 */
          .fl-list { grid-template-columns: repeat(3, 1fr); gap: 6px; }
          .fl-link { padding: 8px 4px; }
          .fl-name { font-size: 12px; }
          .fl-desc { font-size: 10px; }
        }
      </style>
      <div class="fl-wrapper">
        <div class="fl-header">
          <h3>🔗 友情链接</h3>
          <p>更多优惠资源与实用工具，一站直达</p>
        </div>
        <div class="fl-grid-container">
          ${FRIEND_LINKS_DATA.map(section => `
            <div class="fl-section">
              <div class="fl-title">${section.title}</div>
              <div class="fl-list">
                ${section.links.map(link => {
                  const isWxScheme = link.url.startsWith('weixin://') || link.url.startsWith('#小程序://');
                  const onclick = isWxScheme
                    ? ` onclick="if(!/MicroMessenger/i.test(navigator.userAgent)){alert('请在微信中打开此链接');return false;}"`
                    : '';
                  const tag = isWxScheme ? '<span class="fl-miniapp-tag">仅微信</span>' : '';
                  return `
                  <a class="fl-link" href="${link.url}" target="_blank" rel="noopener"${onclick}>
                    <span class="fl-name">${link.name}</span>
                    <span class="fl-desc">${link.desc}</span>
                    ${tag}
                  </a>`;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="fl-footer">
          © 券宝 · 帮你花少钱过好生活
        </div>
      </div>
    `;
  }
}

customElements.define('friend-links', FriendLinks);

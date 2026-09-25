// 同步友情链接数据：从 src/data.js 读取 FRIEND_LINKS_DATA，生成 public/friend-links.js
// 用法：node scripts/sync-friend-links.cjs
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

// ========== 从 src/data.js 提取 FRIEND_LINKS_DATA ==========
function extractFriendLinksData() {
  const code = fs.readFileSync(path.join(ROOT, 'src/data.js'), 'utf8');

  // 找到 FRIEND_LINKS_DATA 的起始和结束位置
  const startMarker = 'export const FRIEND_LINKS_DATA = [';
  const startIdx = code.indexOf(startMarker);
  if (startIdx === -1) {
    throw new Error('在 src/data.js 中未找到 FRIEND_LINKS_DATA');
  }

  // 从 [ 开始找到匹配的 ]
  let bracketCount = 0;
  let endIdx = startIdx + startMarker.length - 1; // 指向 [
  for (let i = endIdx; i < code.length; i++) {
    if (code[i] === '[') bracketCount++;
    if (code[i] === ']') bracketCount--;
    if (bracketCount === 0) {
      endIdx = i + 1;
      break;
    }
  }

  const dataStr = code.slice(startIdx + 'export const '.length, endIdx);
  // 去掉 export const FRIEND_LINKS_DATA =
  const arrayStr = dataStr.replace(/^FRIEND_LINKS_DATA\s*=\s*/, '');

  // 用 Function 执行，返回数组
  const fn = new Function('return ' + arrayStr);
  return fn();
}

// ========== 生成 public/friend-links.js ==========
function generateFriendLinks(data) {
  const header = `// ========== article专用 友情链接 Web Component ==========
// 展示项目所有真实入口链接，按分类组织，用于文章底部
// ⚠️ 此文件由 scripts/sync-friend-links.cjs 自动生成，请勿手动编辑
// 数据源：src/data.js → FRIEND_LINKS_DATA

const FRIEND_LINKS_DATA = ${JSON.stringify(data, null, 2)};

class FriendLinks extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = \`
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
          border-bottom: 2px solid var(--primary, #FF6B35);
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
          border-left: 3px solid var(--primary, #FF6B35);
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
          background: var(--primary-light, #FFF4ED);
          border-color: var(--primary, #FF6B35);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(255,107,53,0.15);
        }
        .fl-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text, #1e293b);
        }
        .fl-link:hover .fl-name { color: var(--primary, #FF6B35); }
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
        }
      </style>
      <div class="fl-wrapper">
        <div class="fl-header">
          <h3>🔗 友情链接</h3>
          <p>更多优惠资源与实用工具，一站直达</p>
        </div>
        <div class="fl-grid-container">
          \${FRIEND_LINKS_DATA.map(section => \`
            <div class="fl-section">
              <div class="fl-title">\${section.title}</div>
              <div class="fl-list">
                \${section.links.map(link => {
                  const isWxScheme = link.url.startsWith('weixin://') || link.url.startsWith('#小程序://');
                  const onclick = isWxScheme
                    ? \` onclick="if(!/MicroMessenger/i.test(navigator.userAgent)){alert('请在微信中打开此链接');return false;}"\`
                    : '';
                  const tag = isWxScheme ? '<span class="fl-miniapp-tag">仅微信</span>' : '';
                  return \`
                  <a class="fl-link" href="\${link.url}" target="_blank" rel="noopener"\${onclick}>
                    <span class="fl-name">\${link.name}</span>
                    <span class="fl-desc">\${link.desc}</span>
                    \${tag}
                  </a>\`;
                }).join('')}
              </div>
            </div>
          \`).join('')}
        </div>
        <div class="fl-footer">
          © 券宝 · 帮你花少钱过好生活
        </div>
      </div>
    \`;
  }
}

customElements.define('friend-links', FriendLinks);
`;

  return header;
}

// ========== 主函数 ==========
function main() {
  try {
    const data = extractFriendLinksData();
    const content = generateFriendLinks(data);
    const outPath = path.join(ROOT, 'public/friend-links.js');
    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`✅ 已生成 public/friend-links.js（${data.length} 个分类）`);
  } catch (err) {
    console.error('❌ 同步失败:', err.message);
    process.exit(1);
  }
}

main();

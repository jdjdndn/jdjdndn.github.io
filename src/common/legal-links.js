/**
 * <legal-links> Web Component
 * 页脚法律链接组件（隐私政策 / 纠错反馈）
 *
 * 用法:
 *   <legal-links></legal-links>
 *
 * 属性:
 *   privacy-url   - 隐私政策链接（默认 ./privacy.html）
 *   feedback-url  - 纠错反馈链接（默认 ./about.html#contact）
 */
class LegalLinks extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const privacyUrl = this.getAttribute('privacy-url') || './privacy.html';
    const feedbackUrl = this.getAttribute('feedback-url') || './about.html#contact';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          border-top: 1px solid rgba(120, 120, 120, 0.16);
          margin-top: 4px;
        }

        .legal-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          padding: 16px 20px 12px;
          font-size: 13px;
          color: #64748b;
          text-align: center;
          line-height: 1.6;
        }

        .legal-links a {
          color: inherit;
          text-decoration: none;
          padding: 2px 6px;
          border-radius: 6px;
          transition: color .2s, background .2s;
        }

        .legal-links a:hover {
          color: #ff6b35;
          background: rgba(255, 107, 53, 0.08);
        }

        .legal-sep {
          opacity: 0.5;
        }

        :host(.dark-mode) .legal-links {
          color: #94a3b8;
          border-top-color: rgba(255, 255, 255, 0.08);
        }

        :host(.dark-mode) .legal-links a:hover {
          color: #ffb08a;
          background: rgba(255, 107, 53, 0.16);
        }

        /* 小屏：紧凑排布 */
        @media (max-width: 767px) {
          .legal-links {
            padding: 12px 12px 10px;
            gap: 8px 10px;
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .legal-links {
            padding: 10px 10px 8px;
            font-size: 11.5px;
          }
        }
      </style>
      <div class="legal-links">
        <a href="${privacyUrl}">🔒 隐私政策</a>
        <span class="legal-sep">·</span>
        <a href="${feedbackUrl}">📮 纠错 / 失效反馈</a>
      </div>
    `;
  }
}

customElements.define('legal-links', LegalLinks);

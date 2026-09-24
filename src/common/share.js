import { $, showToast, vibrate, robustCopy } from './utils.js';
import 'social-share.js/dist/css/share.min.css';

// ---------- 分享 ----------
const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// social-share.js 模板配置
const shareTemplates = {
  qzone: 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{URL}}&title={{TITLE}}&desc={{DESCRIPTION}}&summary={{SUMMARY}}&site={{SOURCE}}',
  qq: 'https://connect.qq.com/widget/shareqq/index.html?url={{URL}}&title={{TITLE}}&source={{SOURCE}}&desc={{DESCRIPTION}}&pics={{IMAGE}}',
  weibo: 'https://service.weibo.com/share/share.php?url={{URL}}&title={{TITLE}}&pic={{IMAGE}}',
};

/** 替换模板变量 */
const renderTemplate = (template, data) => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => encodeURIComponent(data[key] || ''));
};

/** 生成分享 URL */
const getShareUrl = (site, { url, title, description, image }) => {
  const data = {
    URL: url,
    TITLE: title,
    DESCRIPTION: description,
    SUMMARY: description,
    SOURCE: document.title,
    IMAGE: image || '',
  };
  return renderTemplate(shareTemplates[site], data);
};

/** 尝试调起微信分享 */
const shareToWechat = async (name, url, text) => {
  const content = text || `${name} ${url}`;
  // 优先尝试系统分享面板（部分系统可直接分享到微信）
  if (navigator.share) {
    try {
      await navigator.share({ title: name, text: content, url });
      return;
    } catch {}
  }
  // 回退到复制：普通网页无法直接调起微信 App
  await robustCopy(content, '已复制，打开微信粘贴发送给朋友');
};

/** 尝试调起 QQ 分享 */
const shareToQQ = (name, url, text) => {
  const webUrl = getShareUrl('qq', {
    url,
    title: name,
    description: text || name,
  });
  if (isMobile()) {
    // 用 window.open 打开 scheme URL（iframe 会被浏览器拦截）
    const qqScheme = `mqqapi://share/to_fri?src_type=web&share_type=5&url=${encodeURIComponent(url)}&title=${encodeURIComponent(name)}&desc=${encodeURIComponent(text || name)}`;
    const newTab = window.open('about:blank');
    if (newTab) {
      newTab.location.href = qqScheme;
      // 3 秒后检测：若 QQ 未安装，页面会停留在 about:blank，回退到网页版
      setTimeout(() => {
        try {
          if (newTab.location.href === 'about:blank') {
            newTab.location.href = webUrl;
          }
        } catch {
          // 跨域异常说明 QQ 已打开（scheme 生效），忽略
        }
      }, 3000);
    } else {
      // 弹窗被阻止，直接打开网页版
      window.open(webUrl, '_blank', 'noopener');
    }
    showToast('正在打开 QQ…');
  } else {
    window.open(webUrl, '_blank', 'noopener,width=600,height=500');
  }
};

/** 创建分享面板 DOM（仅创建一次） */
const createSharePanel = (trackFn) => {
  if ($('#share-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'share-panel';
  panel.className = 'share-panel hidden';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', '分享');
  panel.innerHTML = `
    <div class="share-panel-mask"></div>
    <div class="share-panel-body">
      <div class="share-panel-header">
        <span class="share-panel-title">分享给朋友</span>
        <button class="share-panel-close" aria-label="关闭">✕</button>
      </div>
      <div class="share-panel-content">
        <p class="share-panel-name" id="share-panel-name"></p>
        <div class="share-panel-options">
          <button class="share-option share-option-wechat" data-action="wechat">
            <span class="share-option-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18z" fill="#09BB07"/><path d="M23.467 14.656c0-3.39-3.352-6.15-7.488-6.15-4.137 0-7.489 2.76-7.489 6.15 0 3.392 3.352 6.152 7.489 6.152.87 0 1.713-.145 2.489-.375a.72.72 0 01.599.082l1.588.93a.272.272 0 00.14.045c.134 0 .242-.11.242-.247a.26.26 0 00-.04-.178l-.327-1.234a.496.496 0 01.177-.554c1.531-1.125 2.62-2.81 2.62-4.641zm-9.862-1.19c-.536 0-.971-.44-.971-.984 0-.544.435-.983.971-.983.537 0 .971.44.971.983 0 .545-.434.984-.971.984zm4.749 0c-.537 0-.971-.44-.971-.984 0-.544.434-.983.971-.983.536 0 .97.44.97.983 0 .545-.434.984-.97.984z" fill="#09BB07"/></svg>
            </span>
            <span class="share-option-label">微信</span>
          </button>
          <button class="share-option share-option-qq" data-action="qq">
            <span class="share-option-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21.395 15.035a39.548 39.548 0 00-1.118-3.567c.173-.713.26-1.457.26-2.22 0-4.37-3.45-7.912-7.7-7.912S4.12 4.878 4.12 9.248c0 .763.087 1.507.26 2.22a39.548 39.548 0 00-1.118 3.567c-.23.948-.43 1.67-.563 2.153-.073.263-.117.453-.117.558 0 .337.273.61.61.61.156 0 .336-.057.54-.17a7.893 7.893 0 004.367 1.323c.563 0 1.115-.075 1.65-.22a5.45 5.45 0 003.182 1.007c1.506 0 2.863-.566 3.803-1.483.205.114.385.17.542.17.336 0 .61-.273.61-.61 0-.105-.044-.295-.118-.558-.132-.484-.332-1.205-.562-2.153zM12.29 4.94c3.14 0 5.69 2.276 5.69 5.082 0 .334-.027.663-.08.987a8.787 8.787 0 00-.937-.415c-.382-.138-.786-.236-1.205-.288a7.89 7.89 0 00-.553-2.61c.87-.516 1.488-1.36 1.488-2.324 0-1.553-1.533-2.813-3.423-2.813-1.89 0-3.423 1.26-3.423 2.813 0 .965.618 1.808 1.488 2.324-.374.162-.733.367-1.073.612-.387-.354-.86-.642-1.398-.836a5.748 5.748 0 00.278-1.777c0-2.806 2.55-5.082 5.69-5.082z" fill="#12B7F5"/><path d="M14.878 11.554c-.248 0-.45-.203-.45-.453 0-.25.202-.452.45-.452.249 0 .45.202.45.452 0 .25-.201.453-.45.453zm-5.524 0c-.248 0-.45-.203-.45-.453 0-.25.202-.452.45-.452.249 0 .45.202.45.452 0 .25-.201.453-.45.453z" fill="#12B7F5"/></svg>
            </span>
            <span class="share-option-label">QQ</span>
          </button>
          <button class="share-option share-option-weibo" data-action="weibo">
            <span class="share-option-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443z" fill="#E6162D"/><path d="M16.968 11.586c-.266-.793-.83-1.183-1.405-1.183-.385 0-.712.182-.898.458-.183.273-.237.631-.134.974.063.21.086.38.086.517 0 .398-.165.648-.403.648-.238 0-.403-.25-.403-.648 0-.253-.044-.532-.16-.787-.344-.756-1.077-1.206-1.88-1.206-.78 0-1.497.432-1.846 1.164-.138.29-.208.604-.208.93 0 .557.17 1.017.472 1.347.27.297.58.472.888.472.373 0 .637-.262.637-.656 0-.156-.04-.302-.115-.426-.127-.21-.192-.446-.192-.694 0-.242.093-.42.237-.42.143 0 .236.178.236.42 0 .15.026.285.075.405.2.496.652.822 1.175.822.738 0 1.343-.52 1.556-1.19.08-.25.124-.516.124-.793 0-.39-.084-.742-.252-1.035z" fill="#E6162D"/><circle cx="16.5" cy="5.5" r="1.5" fill="#FFAD28"/></svg>
            </span>
            <span class="share-option-label">微博</span>
          </button>
          <button class="share-option" data-action="copy-link">
            <span class="share-option-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </span>
            <span class="share-option-label">复制链接</span>
          </button>
          <button class="share-option" data-action="copy-text">
            <span class="share-option-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
            </span>
            <span class="share-option-label">复制口令</span>
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // 关闭面板
  const closePanel = () => panel.classList.add('hidden');
  panel.querySelector('.share-panel-close').addEventListener('click', closePanel);
  panel.querySelector('.share-panel-mask').addEventListener('click', closePanel);
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });

  // 移动端：拖拽面板下滑关闭
  let dragStartY = 0;
  let dragDelta = 0;
  const panelBody = panel.querySelector('.share-panel-body');
  panelBody.addEventListener('touchstart', (e) => {
    dragStartY = e.touches[0].clientY;
    dragDelta = 0;
    panelBody.style.transition = 'none';
  }, { passive: true });
  panelBody.addEventListener('touchmove', (e) => {
    dragDelta = e.touches[0].clientY - dragStartY;
    if (dragDelta > 0) {
      panelBody.style.transform = `translateY(${dragDelta}px)`;
    }
  }, { passive: true });
  panelBody.addEventListener('touchend', () => {
    panelBody.style.transition = '';
    panelBody.style.transform = '';
    if (dragDelta > 100) {
      closePanel();
      vibrate(30);
    }
    dragDelta = 0;
  });

  // 处理分享选项
  panel.querySelector('.share-panel-options').addEventListener('click', async (e) => {
    const option = e.target.closest('.share-option');
    if (!option) return;
    const action = option.dataset.action;
    const shareUrl = panel.dataset.shareUrl || window.location.href;
    const shareName = panel.dataset.shareName || '';
    const shareText = panel.dataset.shareText || '';

    if (action === 'copy-link') {
      await robustCopy(shareUrl, '链接已复制');
    } else if (action === 'copy-text') {
      const content = shareText || shareUrl;
      await robustCopy(content, shareText ? '口令已复制' : '链接已复制');
    } else if (action === 'wechat') {
      if (trackFn) trackFn('share_wechat', { name: shareName });
      await shareToWechat(shareName, shareUrl, shareText);
    } else if (action === 'weibo') {
      if (trackFn) trackFn('share_weibo', { name: shareName });
      const wbUrl = getShareUrl('weibo', {
        url: shareUrl,
        title: shareName,
        description: shareText || shareName,
      });
      window.open(wbUrl, '_blank', 'noopener,width=600,height=500');
    } else if (action === 'qq') {
      if (trackFn) trackFn('share_qq', { name: shareName });
      shareToQQ(shareName, shareUrl, shareText);
    }
    closePanel();
  });
};

/** 分享入口：移动端优先原生分享，失败/桌面端弹出分享面板 */
const shareItem = async (name, url, text) => {
  if (navigator.share) {
    const shareData = text
      ? { title: name, text }
      : { title: name, url };
    try { await navigator.share(shareData); return; } catch {}
  }
  const panel = $('#share-panel');
  panel.dataset.shareName = name || '';
  panel.dataset.shareUrl = url || window.location.href;
  panel.dataset.shareText = text || '';
  $('#share-panel-name').textContent = name || '';
  panel.classList.remove('hidden');
  panel.querySelector('.share-panel-close').focus();
};

export { isMobile, shareToWechat, shareToQQ, createSharePanel, shareItem };

import QRCode from 'qrcode';
import { $, showToast } from './base.js';
import { shareItem } from './share.js';

// ---------- 二维码弹窗 ----------
const createQrModal = () => {
  if ($('#qr-overlay')) return;
  const el = document.createElement('div');
  el.id = 'qr-overlay';
  el.className = 'qr-overlay hidden';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', '手机扫码访问');
  el.innerHTML = `<div class="qr-modal"><div class="qr-header"><span class="qr-title">手机扫码访问</span><button id="qr-close" class="qr-close" aria-label="关闭弹窗">✕</button></div><div class="qr-body"><div id="qr-loading" class="qr-loading"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg><span>生成中…</span></div><img id="qr-img" class="qr-img hidden" alt="QR Code" /><p id="qr-name" class="qr-name"></p><p class="qr-hint">打开浏览器或微信扫一扫</p></div></div>`;
  document.body.appendChild(el);
};

let _qrLastFocused = null;
let _qrCurrentUrl = '';

const showQrModal = async (url, name, generateFn) => {
  _qrLastFocused = document.activeElement;
  _qrCurrentUrl = url;
  const overlay = $('#qr-overlay');
  const img = $('#qr-img');
  const nameEl = $('#qr-name');
  const closeBtn = $('#qr-close');
  const loading = $('#qr-loading');
  loading.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg><span>生成中…</span>';
  loading.classList.remove('hidden');
  img.classList.add('hidden');
  nameEl.textContent = name;
  overlay.classList.remove('hidden');
  closeBtn.focus();
  // 确保 img 加载失败时也能隐藏 loading
  const onImgLoad = () => { loading.classList.add('hidden'); img.classList.remove('hidden'); };
  const onImgError = () => { loading.innerHTML = '<span style="color:var(--danger)">生成失败，请重试</span>'; };
  img.addEventListener('load', onImgLoad, { once: true });
  img.addEventListener('error', onImgError, { once: true });
  try {
    if (generateFn) {
      img.src = await generateFn(url);
    } else {
      img.src = await QRCode.toDataURL(url, { width: 240, margin: 2 });
    }
    // 本地 data URL 立即生效，直接隐藏 loading
    if (img.src.startsWith('data:')) {
      loading.classList.add('hidden');
      img.classList.remove('hidden');
    }
    // 外部 URL 由 img load/error 事件处理
  } catch {
    loading.innerHTML = '<span style="color:var(--danger)">生成失败，请重试</span>';
    img.removeEventListener('load', onImgLoad);
    img.removeEventListener('error', onImgError);
  }
};

const hideQrModal = () => {
  const overlay = $('#qr-overlay');
  const img = $('#qr-img');
  overlay.classList.add('hidden');
  img.src = '';
  _qrCurrentUrl = '';
  if (_qrLastFocused) {
    _qrLastFocused.focus();
    _qrLastFocused = null;
  }
};

// 弹窗事件绑定（全局只绑一次）
const _bindQrEvents = () => {
  const overlay = $('#qr-overlay');
  const closeBtn = $('#qr-close');
  if (!overlay || overlay._bound) return;
  overlay._bound = true;
  closeBtn.addEventListener('click', hideQrModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) hideQrModal(); });
  document.addEventListener('keydown', (e) => {
    if (overlay.classList.contains('hidden')) return;
    if (e.key === 'Escape') { hideQrModal(); return; }
    if (e.key === 'Tab') {
      const focusable = Array.from(overlay.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
};

// QR弹窗分享按钮
const setupQrShare = () => {
  const overlay = $('#qr-overlay');
  if (!overlay) return;
  const qrBody = overlay.querySelector('.qr-body');
  if (!qrBody || qrBody.querySelector('.qr-share')) return;
  const qrImg = $('#qr-img');
  const qrName = $('#qr-name');
  const shareEl = document.createElement('div');
  shareEl.className = 'qr-share';
  shareEl.innerHTML = `<button class="qr-share-copy" aria-label="复制链接">复制链接</button><button class="qr-share-native" aria-label="分享给朋友">分享给朋友</button><button class="qr-share-download" aria-label="保存二维码">保存二维码</button>`;
  qrBody.appendChild(shareEl);
  shareEl.querySelector('.qr-share-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(_qrCurrentUrl); showToast('链接已复制'); } catch { showToast('复制失败'); }
  });
  shareEl.querySelector('.qr-share-native').addEventListener('click', () => {
    shareItem(qrName.textContent, _qrCurrentUrl);
  });
  shareEl.querySelector('.qr-share-download').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = qrImg.src;
    a.download = `${qrName.textContent || 'qrcode'}.png`;
    a.click();
  });
};

// 初始化
createQrModal();
_bindQrEvents();
setupQrShare();

export { createQrModal, showQrModal, hideQrModal };

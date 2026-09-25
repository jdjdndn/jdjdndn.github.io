// ========== 通用工具函数 ==========
// 注意：此文件是 vanilla JS 工具函数的入口。
// 与 composables/ 共享的纯函数从 composables 导入，避免重复定义。
// 如需修改 $、showToast 等仅 vanilla JS 使用的函数，请在此处修改。

export const $ = (sel) => document.querySelector(sel);
export const $$ = (sel) => document.querySelectorAll(sel);

export const showToast = (msg = '已复制') => {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2500);
};

// ========== 从 composables/ 导入共享纯函数（单一来源）==========
export { debounce, isExpired, isExpiringSoon, isNewActivity, isHotActivity, formatCountdown, highlightText, normalizeSections, countUp, getIconForName } from '../composables/useUtils.js';
export { vibrate } from '../composables/useClipboard.js';

// ========== 剪贴板复制（含降级）==========
export const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    if (navigator.vibrate) navigator.vibrate();
    showToast();
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast();
    } catch {
      showToast('复制失败，请长按手动复制');
    }
  }
};

// ========== 剪贴板写入（含降级，自定义提示）==========
export const robustCopy = async (text, successMsg) => {
  try {
    await navigator.clipboard.writeText(text);
    if (navigator.vibrate) navigator.vibrate();
    showToast(successMsg);
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(successMsg);
    } catch {
      showToast('复制失败，请长按手动复制');
    }
  }
};

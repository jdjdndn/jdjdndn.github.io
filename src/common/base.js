// ---------- DOM 快捷 ----------
const $ = (sel) => document.querySelector(sel);

// ---------- Toast ----------
const showToast = (msg = '已复制') => {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2500);
};

// ---------- 触觉反馈 ----------
const vibrate = (ms = 50) => {
  if (navigator.vibrate) navigator.vibrate(ms);
};

// ---------- 剪贴板复制（含降级）----------
const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    vibrate();
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

// ---------- 剪贴板写入（含降级，自定义提示）----------
const robustCopy = async (text, successMsg) => {
  try {
    await navigator.clipboard.writeText(text);
    vibrate();
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

// ---------- Hero 时间自动更新 ----------
// 找到所有带 data-update-time 属性的元素，填入当前年月
const updateHeroTime = () => {
  const now = new Date();
  const text = `${now.getFullYear()}年${now.getMonth() + 1}月`;
  document.querySelectorAll('[data-update-time]').forEach((el) => {
    el.textContent = text;
  });
};
updateHeroTime();

export { $, showToast, vibrate, copyText, robustCopy, updateHeroTime };

// ---------- 暗色模式 ----------
const saved = localStorage.getItem('darkMode');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (saved === 'true' || (!saved && prefersDark)) {
  document.body.classList.add('dark-mode');
  document.documentElement.classList.add('dark-mode');
}

const updateDarkToggleText = () => {
  const textEl = document.getElementById('dark-toggle-text');
  if (textEl) textEl.textContent = document.body.classList.contains('dark-mode') ? '亮色' : '暗色';
};
updateDarkToggleText();

const darkToggle = document.getElementById('dark-toggle');
if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    document.body.classList.add('dark-mode-transition');
    document.body.classList.toggle('dark-mode');
    document.documentElement.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    updateDarkToggleText();
    // 可选 analytics 回调：页面设置 window.__darkModeOnToggle(isDark) 即可
    if (typeof window.__darkModeOnToggle === 'function') window.__darkModeOnToggle(isDark);
    setTimeout(() => document.body.classList.remove('dark-mode-transition'), 400);
  });
}

export { updateDarkToggleText };

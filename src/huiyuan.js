// ========== 会员优惠页面逻辑 ==========

// 暗色模式
const initDarkMode = () => {
  const saved = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'true' || (!saved && prefersDark)) {
    document.body.classList.add('dark-mode');
  }
  updateDarkToggleText();
};

const updateDarkToggleText = () => {
  const textEl = document.getElementById('dark-toggle-text');
  if (textEl) textEl.textContent = document.body.classList.contains('dark-mode') ? '亮色' : '暗色';
};

const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  updateDarkToggleText();
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();

  // 暗色模式切换
  const darkToggle = document.getElementById('dark-toggle');
  if (darkToggle) darkToggle.addEventListener('click', toggleDarkMode);
});

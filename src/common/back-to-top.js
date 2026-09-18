// ---------- 回到顶部按钮（公共模块）----------
// 自动检测页面是否已有 #back-to-top 元素，没有则动态创建
const initBackToTop = () => {
  let btn = document.getElementById('back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.className = 'back-to-top hidden';
    btn.setAttribute('aria-label', '回到顶部');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(btn);
  }

  window.addEventListener('scroll', () => {
    btn.classList.toggle('hidden', window.scrollY < 300);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

export { initBackToTop };

// ========== article 通用交互：阅读进度条 + 返回顶部 ==========
// 轻量、无依赖；长文章阅读体验优化

(function () {
  'use strict';
  if (window.__backTopLoaded) return;
  window.__backTopLoaded = true;

  var doc = document.documentElement;

  // ===== 1. 阅读进度条（顶部 3px） =====
  var bar = document.createElement('div');
  bar.className = 'read-progress';
  document.body.appendChild(bar);

  // ===== 2. 返回顶部按钮 =====
  var btn = document.createElement('button');
  btn.className = 'back-top-btn';
  btn.setAttribute('aria-label', '返回顶部');
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
  btn.type = 'button';
  document.body.appendChild(btn);

  var ticking = false;
  function update() {
    ticking = false;
    var scrollTop = window.scrollY || window.pageYOffset || 0;
    var height = Math.max(1, doc.scrollHeight - window.innerHeight);
    var pct = Math.min(100, Math.max(0, (scrollTop / height) * 100));
    bar.style.width = pct + '%';
    if (scrollTop > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  btn.addEventListener('click', function () {
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
})();

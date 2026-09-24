<template>
  <!-- 侧边栏导航（桌面端） -->
  <nav
    v-if="position === 'side'"
    class="site-nav-side"
    aria-label="页面导航"
  >
    <ul class="nav-list">
      <li v-for="item in navItems" :key="item.path">
        <router-link
          :to="item.path"
          :class="['nav-link', { active: isActive(item) }]"
          :aria-current="isActive(item) ? 'page' : undefined"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="item.icon"></svg>
          <span>{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
  </nav>

  <!-- 底部导航（移动端） -->
  <footer
    v-if="position === 'footer'"
    class="site-nav-footer"
    aria-label="页面导航"
  >
    <ul class="nav-list">
      <li v-for="item in navItems" :key="item.path">
        <router-link
          :to="item.path"
          :class="['nav-link', { active: isActive(item) }]"
          :aria-current="isActive(item) ? 'page' : undefined"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="item.icon"></svg>
          <span>{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  position: {
    type: String,
    default: 'side',
    validator: (value) => ['side', 'footer'].includes(value)
  }
})

const route = useRoute()

// 导航项配置（与原 site-nav.js 一致）
const navItems = [
  {
    path: '/',
    label: '活动',
    icon: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>'
  },
  {
    path: '/waimai.html',
    label: '外卖',
    icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
  },
  {
    path: '/haoka.html',
    label: '号卡',
    icon: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>'
  },
  {
    path: '/wifi.html',
    label: 'WiFi',
    icon: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>'
  },
  {
    path: '/huiyuan.html',
    label: '会员',
    icon: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>'
  },
  {
    path: '/fuye.html',
    label: '副业',
    icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>'
  },
  {
    path: '/about.html',
    label: '关于',
    icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
  }
]

// 判断是否为当前页面
function isActive(item) {
  const currentPath = route.path

  // 处理首页
  if (item.path === '/' && (currentPath === '/' || currentPath === '')) {
    return true
  }

  // 处理其他页面
  if (currentPath === item.path) {
    return true
  }

  // 处理副业子目录
  if (item.path === '/fuye.html' && currentPath.startsWith('/fuye/')) {
    return true
  }

  return false
}
</script>

<style scoped>
/* 隐藏导航防闪烁 - 仅在非 reduced-motion 时动画 */
@media (prefers-reduced-motion: no-preference) {
  .site-nav-side,
  .site-nav-footer {
    animation: navReveal 0.3s ease-out forwards;
    animation-delay: 0.5s;
  }

  @keyframes navReveal {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}

/* ====== 底部导航栏 (position="footer") ====== */
.site-nav-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--nav-bg, #ffffff);
  border-top: 1px solid var(--nav-border, #e5e2dd);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.site-nav-footer .nav-list {
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 48px;
  padding: 0 8px;
  margin: 0;
  list-style: none;
  background: var(--nav-bg, #ffffff);
}

.site-nav-footer .nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex: 1;
  text-decoration: none;
  color: var(--nav-muted, #6b7280);
  font-size: 11px;
  padding: 6px 0;
  border-radius: 8px;
  transition: color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.site-nav-footer .nav-link :deep(svg) {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.site-nav-footer .nav-link.active {
  color: var(--nav-primary, #FF6B35);
  font-weight: 600;
}

.site-nav-footer .nav-link.active :deep(svg) {
  stroke: var(--nav-primary, #FF6B35);
  fill: var(--nav-primary-light, #FFF4ED);
}

.site-nav-footer .nav-link:hover:not(.active) {
  color: var(--nav-text, #1a1a2e);
}

/* 小屏手机微调 */
@media (max-width: 480px) {
  .site-nav-footer {
    height: 44px;
    border-top: 1px solid var(--nav-border, #e5e2dd);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  }
  .site-nav-footer .nav-link { font-size: 9px; }
  .site-nav-footer .nav-link :deep(svg) { width: 20px; height: 20px; }
}

/* 平板及以上隐藏底部导航，只显示侧边栏 */
@media (min-width: 768px) {
  .site-nav-footer {
    display: none;
  }
}

/* ====== 侧边导航栏 (position="side") ====== */
.site-nav-side {
  display: none;
}

/* 中等屏幕：iPad 显示侧边栏 */
@media (min-width: 768px) and (max-width: 1023px) {
  .site-nav-side {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 24px;
    align-self: flex-start;
    width: 56px;
    height: calc(100vh - 70px);
    flex-shrink: 0;
    margin-right: 20px;
    background: var(--nav-bg, #ffffff);
    border: 1px solid var(--nav-border, #e5e2dd);
    border-radius: var(--radius-lg, 16px);
    z-index: 100;
    padding: 10px 0;
    gap: 4px;
    overflow-y: auto;
    scrollbar-width: none;
    transition: background 0.2s ease, border-color 0.2s ease;
  }
}

/* 大屏：桌面端显示侧边栏 */
@media (min-width: 1024px) {
  .site-nav-side {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 24px;
    align-self: flex-start;
    width: 64px;
    height: calc(100vh - 70px);
    flex-shrink: 0;
    margin-right: 30px;
    background: var(--nav-bg, #ffffff);
    border: 1px solid var(--nav-border, #e5e2dd);
    border-radius: var(--radius-lg, 16px);
    z-index: 100;
    padding: 12px 0;
    gap: 4px;
    overflow-y: auto;
    scrollbar-width: none;
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  .site-nav-side::-webkit-scrollbar { display: none; }

  .site-nav-side .nav-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .site-nav-side .nav-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 10px 4px;
    margin: 0 6px;
    border-radius: 10px;
    color: var(--nav-text-secondary, #4a5568);
    text-decoration: none;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .site-nav-side .nav-link :deep(svg) {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .site-nav-side .nav-link.active {
    color: var(--nav-primary, #FF6B35);
    background: var(--nav-primary-light, #FFF4ED);
    font-weight: 600;
  }

  .site-nav-side .nav-link.active :deep(svg) {
    stroke: var(--nav-primary, #FF6B35);
  }

  .site-nav-side .nav-link:hover:not(.active) {
    color: var(--nav-text, #1a1a2e);
    background: var(--nav-hover-bg, #f5f4f1);
  }
}

/* ====== 暗色模式 ====== */
[data-theme="dark"] .site-nav-footer {
  background: var(--nav-bg-dark, #1a1a2e);
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .site-nav-footer .nav-link.active :deep(svg) {
  fill: rgba(255, 107, 53, 0.15);
}

[data-theme="dark"] .site-nav-side {
  background: var(--card, #1a1a2e);
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .site-nav-side .nav-link.active {
  background: rgba(255, 107, 53, 0.1);
  color: var(--nav-primary, #FF6B35);
}
</style>

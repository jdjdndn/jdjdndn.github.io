<template>
  <n-message-provider>
    <n-notification-provider>
      <n-dialog-provider>
        <div class="app-wrapper">
          <SiteNav position="side" />
          <router-view />
          <SiteNav position="footer" />
        </div>
      </n-dialog-provider>
    </n-notification-provider>
  </n-message-provider>
</template>

<script setup>
import { onMounted } from 'vue'
import { NMessageProvider, NNotificationProvider, NDialogProvider } from 'naive-ui'
import SiteNav from './components/SiteNav.vue'
import { useAppStore } from './stores/app'

const appStore = useAppStore()

onMounted(() => {
  // 初始化主题
  appStore.init()
})
</script>

<style>
/* 全局样式 - 使用原来的 CSS 变量 */
:root {
  --bg: #f8f7f4;
  --bg-elevated: #fcfbf9;
  --card: #ffffff;
  --text: #1a1a2e;
  --text-secondary: #4a5568;
  --muted: #6b7280;
  --primary: #FF6B35;
  --primary-hover: #E55A2B;
  --primary-light: #FFF4ED;
  --accent: #004E89;
  --accent-light: #EBF5FF;
  --border: #e5e2dd;
  --border-light: #f0eeeb;
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.03);
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.05), 0 1px 4px rgba(0, 0, 0, 0.03);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.03);
  --shadow-hover: 0 8px 28px rgba(255, 107, 53, 0.1), 0 2px 8px rgba(255, 107, 53, 0.05);
  --radius: 12px;
  --radius-sm: 8px;
  --radius-lg: 16px;
  --transition: 0.2s ease;
  --transition-spring: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  --danger: #DC2626;
  --danger-light: #FEF2F2;
  --success: #16a34a;
  --success-light: #f0fdf4;

  /* 扩展 token */
  --placeholder: #b0aaa0;
  --hover-bg: #f5f4f1;
  --code-bg: #faf9f7;
  --code-border: #e0ddd8;
  --toast-bg: #1f2937;
  --primary-light-hover: #FFE8DD;

  /* Hero 渐变 */
  --hero-gradient: linear-gradient(155deg, #1a0a00 0%, #E04A00 20%, #FF6B35 45%, #FF8F5E 70%, #FFB088 100%);
  --hero-dark-gradient: linear-gradient(155deg, #0a0400 0%, #3d1200 20%, #5a2000 45%, #7a3520 70%, #8c4a30 100%);

  /* iOS Safari / 刘海屏 安全区域 */
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-inset-left: env(safe-area-inset-left, 0px);
  --safe-area-inset-right: env(safe-area-inset-right, 0px);

  /* 导航栏变量 */
  --nav-primary: var(--primary);
  --nav-primary-hover: var(--primary-hover);
  --nav-primary-light: var(--primary-light);
  --nav-bg: #ffffff;
  --nav-bg-dark: #1a1a2e;
  --nav-border: var(--border);
  --nav-text: var(--text);
  --nav-text-secondary: var(--text-secondary);
  --nav-muted: var(--muted);
  --nav-hover-bg: var(--hover-bg);
}

/* 暗色模式变量 */
[data-theme="dark"] {
  --bg: #0f0f23;
  --bg-elevated: #1a1a2e;
  --card: #1e1e35;
  --text: #e8e8f0;
  --text-secondary: #a0a0b8;
  --muted: #707088;
  --border: #2d2d45;
  --border-light: #252540;
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.2);
  --hover-bg: #2a2a45;
  --code-bg: #151528;
  --code-border: #3d3d55;
  --placeholder: #505068;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  color: var(--text);
  background: var(--bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  letter-spacing: 0.01em;
}

/* 焦点样式 */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* 选中文本样式 */
::selection {
  background: rgba(255, 107, 53, 0.2);
  color: inherit;
}

[data-theme="dark"] ::selection {
  background: rgba(255, 107, 53, 0.3);
}

/* 滚动条样式 */
html {
  overflow-x: clip;
  background: var(--bg);
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

#app {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  overflow-x: clip;
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--muted); }

/* 全局链接样式 */
a { color: inherit; }

/* 图片加载过渡 */
img {
  transition: opacity 0.3s ease;
}
img[loading="lazy"] {
  opacity: 0;
}
img[loading="lazy"].loaded {
  opacity: 1;
}

button:disabled { cursor: not-allowed; opacity: 0.5; }

/* app-wrapper 布局 */
.app-wrapper {
  min-height: 100vh;
  padding-bottom: 0;
}

/* 移动端底部留白 */
@media (max-width: 767px) {
  .app-wrapper {
    padding-bottom: 56px;
  }
}

/* iPad 布局 */
@media (min-width: 768px) and (max-width: 1023px) {
  .app-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px calc(16px + var(--safe-area-inset-right)) calc(20px + var(--safe-area-inset-bottom)) calc(16px + var(--safe-area-inset-left));
    position: relative;
  }

  .app-wrapper #app {
    padding: 0;
    margin: 0;
    max-width: 1100px;
    flex: 1;
    min-width: 0;
  }
}

/* 桌面端布局 */
@media (min-width: 1024px) {
  .app-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    max-width: 1100px;
    margin: 0 auto;
    padding: 24px calc(16px + var(--safe-area-inset-right)) calc(20px + var(--safe-area-inset-bottom)) calc(16px + var(--safe-area-inset-left));
    position: relative;
  }

  .app-wrapper #app {
    padding: 0;
    margin: 0;
    max-width: 1100px;
    flex: 1;
    min-width: 0;
  }
}

/* 手机端样式 */
@media (max-width: 480px) {
  #app {
    padding: 14px calc(12px + var(--safe-area-inset-right)) calc(20px + var(--safe-area-inset-bottom)) calc(12px + var(--safe-area-inset-left));
  }
}
</style>

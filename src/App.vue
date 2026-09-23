<template>
  <n-config-provider :theme-overrides="themeOverrides">
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
  </n-config-provider>
</template>

<script setup>
import { onMounted } from 'vue'
import { NConfigProvider, NMessageProvider, NNotificationProvider, NDialogProvider } from 'naive-ui'
import SiteNav from './components/SiteNav.vue'
import { useAppStore } from './stores/app'

const appStore = useAppStore()

// Naive UI 主题：品牌橙，替代默认绿色 primary
const themeOverrides = {
  common: {
    primaryColor: '#FF6B35',
    primaryColorHover: '#FF8A4C',
    primaryColorPressed: '#E55A2B',
    primaryColorSuppl: '#FF6B35',
    borderRadius: '8px'
  }
}

onMounted(() => {
  // 初始化暗色模式
  const saved = localStorage.getItem('darkMode')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (saved === 'true' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
  appStore.init()
})
</script>

<style>
/* 全局样式和 CSS 变量统一定义在 shared.css */

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

<template>
  <div class="app-wrapper">
    <SiteNav position="side" />
    <router-view />
    <SiteNav position="footer" />
    <!-- Toast 通知 -->
    <div v-show="toast.visible.value" class="toast" :class="{ hidden: !toast.visible.value }">
      {{ toast.message.value }}
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import SiteNav from './components/SiteNav.vue'
import { useAppStore } from './stores/app'
import { useToast } from './composables'

const toast = useToast()

const appStore = useAppStore()

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

/* router-view 基础：自定义元素默认 inline，强制 block + 全宽 */
router-view {
  display: block;
  width: 100%;
}

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

  .app-wrapper router-view {
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

  .app-wrapper router-view {
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

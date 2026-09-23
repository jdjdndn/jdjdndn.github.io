<template>
  <Transition name="fade">
    <button
      v-show="visible"
      class="back-to-top"
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

const handleScroll = () => {
  visible.value = window.scrollY >= 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--primary, #FF6B35);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.back-to-top:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 暗色模式 */
[data-theme="dark"] .back-to-top {
  background: var(--primary-dark, #e55a2b);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 小屏适配 */
@media (max-width: 640px) {
  .back-to-top {
    bottom: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
  }
}
</style>

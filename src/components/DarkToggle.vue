<template>
  <button
    v-if="isMobile"
    class="dark-toggle-btn"
    aria-label="切换暗色模式"
    @click="toggleDarkMode"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
    <span>{{ isDark ? '亮色' : '暗色' }}</span>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isDark = ref(false)
const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth <= 1023
}

function toggleDarkMode() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  try {
    localStorage.setItem('darkMode', isDark.value)
  } catch (_) {}
  if (typeof window.__darkModeOnToggle === 'function') {
    window.__darkModeOnToggle(isDark.value)
  }
}

function syncDarkMode() {
  isDark.value = document.documentElement.getAttribute('data-theme') === 'dark'
}

onMounted(() => {
  checkMobile()
  syncDarkMode()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.dark-toggle-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: fixed;
  top: calc(var(--safe-area-inset-top, 0px) + 12px);
  right: 12px;
  z-index: 150;
}

.dark-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.35);
}

:global([data-theme="dark"]) .dark-toggle-btn {
  background: rgba(26, 26, 46, 0.9);
  border-color: rgba(255, 255, 255, 0.12);
}

@media (min-width: 1024px) {
  .dark-toggle-btn {
    display: none;
  }
}
</style>

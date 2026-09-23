<template>
  <main class="gouwu-page">
    <!-- iframe 内容区 -->
    <div class="iframe-container">
      <div v-if="loading" class="iframe-loading">
        <div class="loading-spinner"></div>
        <p>正在加载优惠内容...</p>
      </div>
      <div v-if="loadError" class="iframe-error">
        <p>加载超时，请检查网络后重试</p>
        <button class="retry-btn" @click="retryLoad">刷新重试</button>
      </div>
      <iframe
        ref="iframeRef"
        :src="iframeSrc"
        class="shop-iframe"
        title="购物优惠"
        sandbox="allow-scripts allow-same-origin allow-popups"
        @load="onLoad"
        @error="onError"
      ></iframe>
    </div>

    <LegalLinks />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LegalLinks from '../components/LegalLinks.vue'

const iframeRef = ref(null)
const loading = ref(true)
const loadError = ref(false)
const iframeSrc = 'http://yh.kdje3.cn/wechat/#/master/0cf6962f0eadc3974b06fcd79dab0af5/home?ucode=jPj0Gxx9ko'

let timeout = null

onMounted(() => {
  // 15 秒超时检测
  timeout = setTimeout(() => {
    if (loading.value) {
      loadError.value = true
      loading.value = false
    }
  }, 15000)
})

function onLoad() {
  loading.value = false
  loadError.value = false
  if (timeout) clearTimeout(timeout)
}

function onError() {
  loading.value = false
  loadError.value = true
  if (timeout) clearTimeout(timeout)
}

function retryLoad() {
  loading.value = true
  loadError.value = false
  if (iframeRef.value) {
    iframeRef.value.src = iframeSrc
  }
  // 重新设置超时
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    if (loading.value) {
      loadError.value = true
      loading.value = false
    }
  }, 15000)
}
</script>

<style scoped>
.iframe-container {
  position: relative;
  width: 100%;
  min-height: 600px;
  margin: 0 auto;
  max-width: 1100px;
  padding: 0 16px;
}

.shop-iframe {
  width: 100%;
  height: 80vh;
  min-height: 600px;
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
  background: var(--card, #fff);
}

/* 加载状态 */
.iframe-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: var(--card, #fff);
  border-radius: 12px;
  z-index: 1;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border, #e5e2dd);
  border-top-color: var(--primary, #FF6B35);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.iframe-loading p {
  font-size: 14px;
  color: var(--muted, #6b7280);
}

/* 错误状态 */
.iframe-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: var(--card, #fff);
  border-radius: 12px;
  z-index: 1;
}

.iframe-error p {
  font-size: 14px;
  color: var(--muted, #6b7280);
}

.retry-btn {
  padding: 8px 20px;
  background: var(--primary, #FF6B35);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: var(--primary-hover, #E55A2B);
}

/* 暗色模式 */
[data-theme="dark"] .shop-iframe {
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .iframe-loading,
[data-theme="dark"] .iframe-error {
  background: var(--card, #1e1e35);
}
</style>

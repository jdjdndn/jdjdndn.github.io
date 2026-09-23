<template>
  <div class="skeleton-card" :class="`skeleton-${type}`">
    <div v-if="type === 'jingxuan'" class="skeleton skeleton-img"></div>
    <div class="skeleton skeleton-line" :class="lineClass"></div>
    <div v-if="type === 'code'" class="skeleton skeleton-code-box"></div>
    <div v-if="type === 'link'" class="skeleton skeleton-link-url"></div>
    <div class="skeleton-btn-group">
      <div class="skeleton skeleton-btn primary"></div>
      <div v-if="showSecondaryBtn" class="skeleton skeleton-btn secondary"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'code',
    validator: (v) => ['code', 'link', 'jingxuan'].includes(v)
  },
  lineClass: {
    type: String,
    default: 'full'
  },
  showSecondaryBtn: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.skeleton-card {
  background: var(--card, #fff);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--border, #e5e7eb);
}

.skeleton {
  background: linear-gradient(90deg, var(--skeleton-bg, #f0f0f0) 25%, var(--skeleton-shine, #e0e0e0) 50%, var(--skeleton-bg, #f0f0f0) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 6px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-line {
  height: 16px;
  margin-bottom: 12px;
}

.skeleton-line.full {
  width: 100%;
}

.skeleton-line.medium {
  width: 70%;
}

.skeleton-line.short {
  width: 50%;
}

.skeleton-img {
  width: 100%;
  height: 120px;
  margin-bottom: 12px;
}

.skeleton-code-box {
  height: 40px;
  width: 100%;
  margin-bottom: 12px;
}

.skeleton-link-url {
  height: 20px;
  width: 60%;
  margin-bottom: 12px;
}

.skeleton-btn-group {
  display: flex;
  gap: 8px;
}

.skeleton-btn {
  height: 32px;
  border-radius: 6px;
}

.skeleton-btn.primary {
  width: 80px;
}

.skeleton-btn.secondary {
  width: 60px;
}

/* 暗色模式 */
[data-theme="dark"] .skeleton {
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
  background-size: 200% 100%;
}

[data-theme="dark"] .skeleton-card {
  background: rgba(31, 41, 55, 0.5);
  border-color: rgba(75, 85, 99, 0.5);
}
</style>

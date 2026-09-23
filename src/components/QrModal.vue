<template>
  <Transition name="modal">
    <div v-if="visible" class="qr-modal-mask" @click.self="close">
      <div class="qr-modal">
        <div class="qr-modal-header">
          <span class="qr-modal-title">{{ title }}</span>
          <button class="qr-modal-close" aria-label="关闭" @click="close">✕</button>
        </div>
        <div class="qr-modal-body">
          <div class="qr-code">
            <img :src="qrUrl" :alt="title" />
          </div>
          <p class="qr-tip">扫码访问</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  url: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: '二维码'
  }
})

const emit = defineEmits(['close'])

const qrUrl = computed(() => {
  if (!props.url) return ''
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(props.url)}`
})

const close = () => {
  emit('close')
}
</script>

<style scoped>
.qr-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.qr-modal {
  background: var(--card, #fff);
  border-radius: 16px;
  max-width: 300px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.qr-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, #e5e7eb);
}

.qr-modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text, #1f2937);
}

.qr-modal-close {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: var(--hover-bg, #f3f4f6);
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.qr-modal-close:hover {
  background: var(--border, #e5e7eb);
  color: var(--text, #1f2937);
}

.qr-modal-body {
  padding: 24px;
  text-align: center;
}

.qr-code {
  width: 200px;
  height: 200px;
  margin: 0 auto 16px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  border: 1px solid var(--border, #e5e7eb);
}

.qr-code img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-tip {
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  margin: 0;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .qr-modal,
.modal-leave-active .qr-modal {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .qr-modal,
.modal-leave-to .qr-modal {
  transform: scale(0.9);
}

/* 暗色模式 */
[data-theme="dark"] .qr-modal {
  background: var(--card-dark, #1f2937);
}

[data-theme="dark"] .qr-code {
  background: white;
  border-color: rgba(255, 255, 255, 0.1);
}
</style>

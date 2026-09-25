<template>
  <main class="fuye-page">
      <PageHero
        :icon="config.icon"
        :title="config.title"
        :subtitle="config.subtitle"
        :aria="config.title"
      >
        <span class="stat-badge">
          <strong>{{ config.statNum }}</strong> {{ config.statLabel }}
        </span>
      </PageHero>

      <!-- 简介区 -->
      <div class="intro-section">
        <div class="card card--no-border">
          <div class="card-header">💡 什么是{{ config.title }}？</div>
          <p>{{ config.intro }}</p>
        </div>
      </div>

      <!-- 横幅入口 -->
      <div v-if="config.banner" class="banner-section">
        <div class="card hoverable banner-card" @click="handleEntryClick(config.banner)">
          <div class="banner-item">
            <div class="banner-icon">{{ config.banner.icon }}</div>
            <div class="banner-text">
              <div class="banner-name">{{ config.banner.name }}</div>
              <div class="banner-desc">{{ config.banner.desc }}</div>
            </div>
            <div class="banner-arrow">→</div>
          </div>
        </div>
      </div>

      <!-- 入口链接 -->
      <div class="entry-grid">
        <div
          v-for="entry in config.entries"
          :key="entry.id"
          class="card hoverable entry-card"
          @click="handleEntryClick(entry)"
        >
          <div class="entry-item">
            <div class="entry-icon">{{ entry.icon }}</div>
            <div class="entry-text">
              <div class="entry-name">{{ entry.name }}</div>
              <div class="entry-desc">{{ entry.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细指导 -->
      <div class="guide-section">
        <div class="card card--no-border">
          <div class="card-header">📖 详细指导 · 实操步骤</div>
          <div v-for="guide in config.guides" :key="guide.id" class="guide-item">
            <div class="guide-head">
              <div class="guide-no">{{ guide.id }}</div>
              <div>
                <div class="guide-title">{{ guide.title }}</div>
                <div class="guide-desc">{{ guide.desc }}</div>
              </div>
            </div>
            <ol v-if="guide.steps && guide.steps.length" class="guide-steps">
              <li v-for="(step, i) in guide.steps" :key="i">{{ step }}</li>
            </ol>
            <a
              v-if="guide.url"
              :href="guide.url"
              class="guide-link"
              :target="guide.url.startsWith('http') ? '_blank' : '_self'"
              :rel="guide.url.startsWith('http') ? 'noopener' : undefined"
            >
              查看完整实操指南 →
            </a>
          </div>
        </div>
      </div>

      <p class="f-note">💡 选择适合你的入口开始 · 零成本起步，多一份收入</p>

      <LegalLinks />
      <BackToTop />

    <!-- 信息弹窗（用于无 url 的入口，展示操作指引） -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="infoModal.visible" class="info-modal-mask" @click.self="closeInfoModal">
          <div class="info-modal">
            <div class="info-modal-header">
              <span class="info-modal-title">{{ infoModal.title }}</span>
              <button class="info-modal-close" aria-label="关闭" @click="closeInfoModal">✕</button>
            </div>
            <div class="info-modal-body">
              <p class="info-modal-desc">{{ infoModal.desc }}</p>
              <div v-if="infoModal.copyText" class="info-modal-copy-section">
                <span class="info-modal-label">{{ infoModal.copyLabel }}</span>
                <span class="info-modal-copy-value">{{ infoModal.copyText }}</span>
                <button class="info-modal-copy-btn" @click="copyToClipboard(infoModal.copyText)">
                  {{ copied ? '✓ 已复制' : '复制' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'
import BackToTop from '../components/BackToTop.vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

const router = useRouter()

// 信息弹窗状态
const infoModal = reactive({
  visible: false,
  title: '',
  desc: '',
  copyText: '',
  copyLabel: ''
})
const copied = ref(false)

function openInfoModal(entry) {
  // 从 desc 中提取公众号名称和邀请码
  const desc = entry.desc || ''
  const accountMatch = desc.match(/【(.+?)】/)
  const codeMatch = desc.match(/邀请码[：:]\s*(\S+)/)

  infoModal.title = entry.name
  infoModal.desc = desc
  infoModal.copyText = accountMatch ? accountMatch[1] : ''
  infoModal.copyLabel = '公众号名称'
  infoModal.visible = true
  copied.value = false
}

function closeInfoModal() {
  infoModal.visible = false
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // 降级方案
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

function handleEntryClick(entry) {
  // 无 url 时弹窗展示指引
  if (!entry.url) {
    openInfoModal(entry)
    return
  }
  if (entry.url.startsWith('weixin://') || entry.url.startsWith('#小程序://')) {
    if (/MicroMessenger/i.test(navigator.userAgent)) {
      window.location.href = entry.url
    } else {
      openInfoModal({ name: entry.name, desc: '请复制下方口令，在微信中打开', copyText: entry.url, copyLabel: '小程序口令' })
    }
  } else if (entry.url.startsWith('http')) {
    window.open(entry.url, '_blank', 'noopener')
  } else if (entry.url.startsWith('/article/')) {
    window.location.href = entry.url
  } else {
    router.push(entry.url)
  }
}
</script>

<style scoped>
/* 页面容器 */
.fuye-page {
  /* max-width: 960px; */
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
}

/* 简介区 */
.intro-section {
  margin-bottom: 32px;
}

.intro-section p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary, #4a5568);
  margin: 0;
}

/* 入口网格 */
.entry-grid {
  max-width: 800px;
  margin: 0 auto 32px;
  padding: 0 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.entry-card {
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 20px;
  background: linear-gradient(135deg, var(--primary-light, #fff7ed) 0%, var(--card, #fff) 100%);
}

.entry-card:hover {
  border-color: var(--primary, #f97316);
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.18);
  transform: translateY(-2px);
}

/* 移动端增大点击区域 */
@media (max-width: 640px) {
  .entry-card { padding: 22px 16px; }
  .entry-icon { width: 48px; height: 48px; font-size: 24px; }
}

.entry-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.entry-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--primary-light, #fff7ed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.entry-text {
  flex: 1;
  min-width: 0;
}

.entry-name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
}

.entry-desc {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 横幅入口 */
.banner-section {
  margin-bottom: 24px;
}

.banner-card {
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, var(--primary-light, #fff7ed) 0%, #fff 100%);
  border: 1px solid var(--primary, #f97316);
}

.banner-card:hover {
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.15);
  transform: translateY(-2px);
}

.banner-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.banner-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--primary, #f97316);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.banner-text {
  flex: 1;
  min-width: 0;
}

.banner-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text, #1a1a2e);
  margin-bottom: 4px;
}

.banner-desc {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.banner-arrow {
  font-size: 20px;
  color: var(--primary, #f97316);
  font-weight: 600;
  flex-shrink: 0;
}

/* 详细指导 */
.guide-section {
  margin-bottom: 48px;
}

.guide-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--border-light, #f0eeeb);
}

.guide-item:last-child {
  border-bottom: none;
}

.guide-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.guide-no {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary-light, #fff7ed);
  color: var(--primary, #f97316);
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.guide-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text, #1a1a2e);
}

.guide-desc {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  margin-top: 2px;
}

.guide-steps {
  margin: 10px 0 8px 40px;
  padding: 0;
  counter-reset: step;
}

.guide-steps li {
  list-style: none;
  position: relative;
  padding-left: 28px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary, #4a5568);
  counter-increment: step;
}

/* 移除了 ::before 伪元素，因为 step 数据已包含 "第N步" 前缀 */

.guide-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 40px;
  margin-top: 8px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary, #f97316);
  text-decoration: none;
  background: var(--primary-light, #fff7ed);
  border-radius: 8px;
  transition: background .2s, transform .1s;
}

.guide-link:hover {
  background: rgba(249, 115, 22, 0.15);
}

.guide-link:active {
  transform: scale(0.97);
}

[data-theme="dark"] .guide-item {
  border-color: var(--border, #2d2d45);
}

/* 底部提示 */
.f-note {
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  margin-bottom: 48px;
}

/* 暗色模式 */
[data-theme="dark"] .entry-card {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.12), var(--card, #1e1e35));
}
[data-theme="dark"] .entry-icon {
  background: rgba(249, 115, 22, 0.15);
}
[data-theme="dark"] .banner-card {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.08));
  border-color: rgba(249, 115, 22, 0.4);
}
[data-theme="dark"] .guide-no {
  background: rgba(249, 115, 22, 0.15);
}
[data-theme="dark"] .guide-link {
  background: rgba(249, 115, 22, 0.15);
}
[data-theme="dark"] .guide-link:hover {
  background: rgba(249, 115, 22, 0.25);
}
[data-theme="dark"] .guide-item {
  border-color: var(--border, #2d2d45);
}

/* 信息弹窗 */
.info-modal-mask {
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

.info-modal {
  background: var(--card, #fff);
  border-radius: 16px;
  max-width: 360px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.info-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, #e5e7eb);
}

.info-modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text, #1f2937);
}

.info-modal-close {
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

.info-modal-close:hover {
  background: var(--border, #e5e7eb);
  color: var(--text, #1f2937);
}

.info-modal-body {
  padding: 20px;
}

.info-modal-desc {
  font-size: 14px;
  color: var(--text-secondary, #4a5568);
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.info-modal-copy-section {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--hover-bg, #f5f4f1);
  border-radius: 10px;
}

.info-modal-label {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  white-space: nowrap;
}

.info-modal-copy-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--primary, #FF6B35);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-modal-copy-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  background: var(--primary, #FF6B35);
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease;
}

.info-modal-copy-btn:hover {
  background: var(--primary-hover, #E55A2B);
}

/* 弹窗过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-active .info-modal,
.modal-leave-active .info-modal {
  transition: transform 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .info-modal,
.modal-leave-to .info-modal {
  transform: scale(0.9);
}

/* 暗色模式 */
[data-theme="dark"] .info-modal {
  background: var(--card, #1a1a2e);
}
[data-theme="dark"] .info-modal-header {
  border-color: var(--border, #2d2d45);
}
[data-theme="dark"] .info-modal-desc {
  color: var(--text-secondary, #a0a0b8);
}
[data-theme="dark"] .info-modal-copy-section {
  background: rgba(255, 107, 53, 0.08);
}
</style>

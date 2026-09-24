<template>
  <main class="wangpan-page">
      <PageHero
        icon='<path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/>'
        title="网盘资源"
        subtitle="精选资源 · 百度 / 夸克网盘免费分享"
        aria="网盘资源"
      />

      <!-- 信任徽章 -->
      <div class="trust-bar" role="list" aria-label="服务保障">
        <span class="trust-item" role="listitem">✓ 正规渠道</span>
        <span class="trust-item" role="listitem">✓ 安全可靠</span>
        <span class="trust-item" role="listitem">✓ 持续更新</span>
      </div>

      <div class="card">
        <div class="section-header">
          <span>网盘资源</span>
          <span class="text-muted">
            共 {{ resources.length }} 个资源
          </span>
        </div>

        <div class="grid-3">
          <div v-for="resource in resources" :key="resource.id" class="grid-item">
            <div class="resource-card card hoverable">
              <div class="card-top" :style="{ background: getResourceColor(resource.url) }"></div>
              <div class="card-body">
                <div class="card-header">
                  <div class="platform-icon">
                    <span v-html="getResourceIcon(resource.url)"></span>
                  </div>
                  <div class="resource-info">
                    <span class="resource-name">{{ resource.name }}</span>
                  </div>
                  <span :class="['tag', 'tag-' + getPlatformType(resource.url)]">
                    {{ getPlatformName(resource.url) }}
                  </span>
                </div>
                <div class="card-actions">
                  <a
                    class="btn btn-primary btn-block"
                    :href="resource.url"
                    target="_blank"
                    rel="noopener"
                  >
                    ↗ 前往访问
                  </a>
                  <button class="btn btn-block" @click="showQR(resource)">
                    ⊞ 扫码
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LegalLinks />
      <QrModal
        :visible="showQr"
        :url="qrResource?.url || ''"
        :title="qrResource?.name || ''"
        @close="closeQrModal"
      />
      <BackToTop />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'
import BackToTop from '../components/BackToTop.vue'
import QrModal from '../components/QrModal.vue'

const showQr = ref(false)
const qrResource = ref(null)

const resources = ref([
  { id: 1, name: '《亚马逊原版电子书》7000本', url: 'https://pan.quark.cn/s/88272c47ef63' },
  { id: 2, name: '咸鱼实战运营教程', url: 'https://pan.quark.cn/s/8ad27c109e4e' },
  { id: 3, name: '闲鱼爆单', url: 'https://pan.quark.cn/s/ec53dfa113f5' },
  { id: 4, name: '闲鱼教程', url: 'https://pan.baidu.com/s/1WTEoO76WeSWOXoX6sGjLBg?pwd=e95h' },
  { id: 5, name: '微信公众号', url: 'https://pan.baidu.com/s/1hmTYESwt4oD-JzaVrgAU1Q?pwd=y48u' },
  { id: 6, name: '天诺老吴TikTok出海计划', url: 'https://pan.baidu.com/s/17W0lTYyKqJwBGwnGxY5qDA?pwd=3dm3' },
  { id: 7, name: 'AIGC课程合集', url: 'https://pan.baidu.com/s/1QEOUa8twpSxut5_DX4LOMg?pwd=63fh' },
  { id: 8, name: '2026AI女装短视频带货教程', url: 'https://pan.baidu.com/s/1OqX6FdufSQZymuNJF0TsEg?pwd=ygt2' },
  { id: 9, name: '2026自媒体运营教程', url: 'https://pan.baidu.com/s/13Xt8KNDzFWdX8Ock8wyBeA?pwd=xkqq' },
  { id: 10, name: '99套小吃配方+创业落地指南', url: 'https://pan.quark.cn/s/fe9df038e605' },
  { id: 11, name: '引流变现课程', url: 'https://pan.baidu.com/s/1b7m9OYjLAZKEcvCASKQwpw?pwd=ndje' },
  { id: 12, name: '车载MV资源', url: 'https://pan.quark.cn/s/eaf8e764baeb' },
  { id: 13, name: '490张音乐专辑', url: 'https://pan.quark.cn/s/e5a0db5fb51e' },
])

function getResourceIcon(url) {
  if (url.includes('quark')) {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>'
  }
  return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>'
}

function getPlatformName(url) {
  if (url.includes('quark')) return '夸克网盘'
  if (url.includes('baidu')) return '百度网盘'
  return '网盘'
}

function getPlatformType(url) {
  if (url.includes('quark')) return 'success'
  if (url.includes('baidu')) return 'info'
  return 'default'
}

function getResourceColor(url) {
  if (url.includes('quark')) return 'linear-gradient(90deg, #FF6B35, #FF8C5A)'
  if (url.includes('baidu')) return 'linear-gradient(90deg, #E55A2B, #FF6B35)'
  return 'linear-gradient(90deg, #6B7280, #9CA3AF)'
}

function showQR(resource) {
  qrResource.value = resource
  showQr.value = true
}

function closeQrModal() {
  showQr.value = false
  qrResource.value = null
}
</script>

<style scoped>
/* --- 基础组件样式 --- */
.card {
  background: var(--card-bg, #fff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  padding: 16px;
}

.card.hoverable {
  transition: transform 0.25s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)),
              box-shadow 0.25s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));
}

.card.hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-md, rgba(0, 0, 0, 0.1));
}

.text-muted {
  font-size: 14px;
  color: var(--text-color-3, #9ca3af);
}

/* --- 网格布局 --- */
.grid-3 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 640px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

.grid-item {
  min-width: 0;
}

/* --- 标签 --- */
.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  white-space: nowrap;
}

.tag-success {
  color: var(--success-color, #16a34a);
  background: var(--success-bg, rgba(22, 163, 74, 0.1));
}

.tag-info {
  color: var(--info-color, #3b82f6);
  background: var(--info-bg, rgba(59, 130, 246, 0.1));
}

.tag-default {
  color: var(--text-color-3, #6b7280);
  background: var(--default-bg, rgba(107, 114, 128, 0.1));
}

/* --- 按钮 --- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid var(--border-color, #d1d5db);
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  background: var(--card-bg, #fff);
  color: var(--text-color, #374151);
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}

.btn:hover {
  border-color: var(--primary-color, #FF6B35);
}

.btn-primary {
  background: var(--primary-color, #FF6B35);
  color: #fff;
  border-color: var(--primary-color, #FF6B35);
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-block {
  width: 100%;
}

/* --- 页面特定样式 --- */
.trust-bar {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
  padding: 12px 16px;
}

.trust-item {
  font-size: 13px;
  color: var(--success, #16a34a);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.resource-card {
  overflow: hidden;
}

.resource-card:hover {
  border-color: var(--primary-color, #FF6B35);
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.1);
}

.card-top {
  height: 8px;
  margin: -16px -16px 12px -16px;
}

.card-body {
  padding: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.platform-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(124, 58, 237, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color, #FF6B35);
}

.resource-info {
  flex: 1;
  min-width: 0;
}

.resource-name {
  font-size: 14px;
  font-weight: 500;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
</style>

<template>
  <main class="wangpan-page">
      <PageHero
        icon='<path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/>'
        title="网盘资源"
        subtitle="百度网盘 · 夸克网盘 · 资源分享"
        aria="网盘资源"
      />

      <!-- 信任徽章 -->
      <div class="trust-bar" role="list" aria-label="服务保障">
        <span class="trust-item" role="listitem">✓ 正规渠道</span>
        <span class="trust-item" role="listitem">✓ 安全可靠</span>
        <span class="trust-item" role="listitem">✓ 持续更新</span>
      </div>

      <n-card :bordered="false">
        <template #header>
          <div class="section-header">
            <span>网盘资源</span>
            <n-text depth="3" style="font-size: 14px">
              共 {{ resources.length }} 个资源
            </n-text>
          </div>
        </template>

        <n-grid :cols="3" :x-gap="12" :y-gap="12" responsive="screen" item-responsive>
          <n-gi v-for="resource in resources" :key="resource.id" span="3 m:1">
            <n-card class="resource-card" hoverable>
              <div class="card-top" :style="{ background: getResourceColor(resource.url) }"></div>
              <div class="card-body">
                <div class="card-header">
                  <div class="platform-icon">
                    <span v-html="getResourceIcon(resource.url)"></span>
                  </div>
                  <div class="resource-info">
                    <span class="resource-name">{{ resource.name }}</span>
                  </div>
                  <n-tag size="small" :type="getPlatformType(resource.url)">
                    {{ getPlatformName(resource.url) }}
                  </n-tag>
                </div>
                <div class="card-actions">
                  <n-button
                    type="primary"
                    size="small"
                    tag="a"
                    :href="resource.url"
                    target="_blank"
                    rel="noopener"
                  >
                    <template #icon>
                      <span>↗</span>
                    </template>
                    前往访问
                  </n-button>
                  <n-button size="small" @click="showQR(resource)">
                    <template #icon>
                      <span>⊞</span>
                    </template>
                    扫码
                  </n-button>
                </div>
              </div>
            </n-card>
          </n-gi>
        </n-grid>
      </n-card>

      <LegalLinks />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'

const message = useMessage()

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
  { id: 14, name: '网络套图', url: 'https://pan.quark.cn/s/1b69157e8677' },
  { id: 15, name: '街拍买家秀', url: 'https://pan.quark.cn/s/defad2b3ddd5' },
  { id: 16, name: '美女博主舞蹈', url: 'https://pan.quark.cn/s/b257fb2c8aef' }
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
  if (url.includes('quark')) return 'linear-gradient(90deg, #7C3AED, #A78BFA)'
  if (url.includes('baidu')) return 'linear-gradient(90deg, #3B82F6, #60A5FA)'
  return 'linear-gradient(90deg, #6B7280, #9CA3AF)'
}

function showQR(resource) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(resource.url)}`
  message.info(`二维码：${resource.name}`)
}
</script>

<style scoped>
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
}

.resource-card {
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.resource-card:hover {
  border-color: #7C3AED;
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
  color: #7C3AED;
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
  display: flex;
  gap: 8px;
}
</style>

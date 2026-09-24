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
        <div class="card">
          <h3 class="card-title">💡 什么是{{ config.title }}？</h3>
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
        <h3 class="card-title">📖 详细指导 · 实操步骤</h3>
        <div class="card">
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
  </main>
</template>

<script setup>
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

function handleEntryClick(entry) {
  if (entry.url) {
    if (entry.url.startsWith('http')) {
      window.open(entry.url, '_blank', 'noopener')
    } else if (entry.url.startsWith('/article/')) {
      // 文章页是静态文件，需要硬跳转
      window.location.href = entry.url
    } else {
      // Vue 路由页，用 router.push
      router.push(entry.url)
    }
  }
}
</script>

<style scoped>
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
}

.entry-card:hover {
  border-color: var(--primary, #f97316);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.1);
  transform: translateY(-1px);
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
  display: inline-block;
  margin-left: 40px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary, #f97316);
  text-decoration: none;
}

.guide-link:hover {
  text-decoration: underline;
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

[data-theme="dark"] .guide-item {
  border-color: var(--border, #2d2d45);
}
</style>

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
        <n-card :bordered="false">
          <template #header>
            <span>💡 什么是{{ config.title }}？</span>
          </template>
          <p>{{ config.intro }}</p>
        </n-card>
      </div>

      <!-- 横幅入口 -->
      <div v-if="config.banner" class="banner-section">
        <n-card hoverable class="banner-card" @click="handleEntryClick(config.banner)">
          <div class="banner-item">
            <div class="banner-icon">{{ config.banner.icon }}</div>
            <div class="banner-text">
              <div class="banner-name">{{ config.banner.name }}</div>
              <div class="banner-desc">{{ config.banner.desc }}</div>
            </div>
            <div class="banner-arrow">→</div>
          </div>
        </n-card>
      </div>

      <!-- 入口链接 -->
      <div class="entry-grid">
        <n-card
          v-for="entry in config.entries"
          :key="entry.id"
          hoverable
          class="entry-card"
          @click="handleEntryClick(entry)"
        >
          <div class="entry-item">
            <div class="entry-icon">{{ entry.icon }}</div>
            <div class="entry-text">
              <div class="entry-name">{{ entry.name }}</div>
              <div class="entry-desc">{{ entry.desc }}</div>
            </div>
          </div>
        </n-card>
      </div>

      <!-- 详细指导 -->
      <div class="guide-section">
        <n-card title="📖 详细指导" :bordered="false">
          <n-list hoverable clickable>
            <n-list-item v-for="guide in config.guides" :key="guide.id">
              <n-thing>
                <template #header>
                  <n-a :href="guide.url" target="_blank" rel="noopener">
                    {{ guide.title }}
                  </n-a>
                </template>
                <template #description>
                  {{ guide.desc }}
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
        </n-card>
      </div>

      <p class="f-note">💡 选择适合你的入口开始 · 零成本起步，多一份收入</p>

      <LegalLinks />
  </main>
</template>

<script setup>
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

function handleEntryClick(entry) {
  if (entry.url) {
    if (entry.url.startsWith('http')) {
      window.open(entry.url, '_blank', 'noopener')
    } else {
      window.location.href = entry.url
    }
  }
}
</script>

<style scoped>
/* 简介区 */
.intro-section {
  margin-bottom: 32px;
}

.intro-section :deep(.n-card) {
  background: var(--card, #fff);
  border-radius: 12px;
}

.intro-section :deep(.n-card__header) {
  font-size: 18px;
  font-weight: 700;
}

.intro-section p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary, #4a5568);
  margin: 0;
}

/* 入口网格 */
.entry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 32px;
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
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--primary-light, #fff7ed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.entry-text {
  flex: 1;
  min-width: 0;
}

.entry-name {
  font-size: 14px;
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

.guide-section :deep(.n-list) {
  background: transparent;
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
</style>

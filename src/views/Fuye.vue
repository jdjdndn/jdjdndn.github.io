<template>
  <main class="fuye-page">
    <PageHero
      icon='<path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>'
      title="项目专区"
      subtitle="项目机会梳理 · 多方向攻略"
      aria="项目专区"
    >
      <span class="stat-badge"><strong>{{ projectCount }}</strong> 项目方向</span>
      <span class="stat-badge"><strong>{{ guideCount }}+</strong> 篇攻略</span>
      <span class="stat-badge"><strong>0</strong> 元成本起步</span>
    </PageHero>

    <!-- 项目分类入口 -->
    <div class="grid-3 entry-grid">
      <div v-for="(entry, idx) in entries" :key="entry.name" :class="['grid-item', 'entry-grid-item', idx === entries.length - 1 ? 'full-width' : '']">
        <component :is="entry.url ? 'router-link' : 'div'" :to="entry.url || undefined" class="entry-card">
          <div class="entry-icon">{{ entry.icon }}</div>
          <div class="entry-info">
            <div class="entry-name">{{ entry.name }}</div>
            <div class="entry-desc">{{ entry.desc }}</div>
          </div>
          <span :class="['tag', 'tag-' + (entry.tagType || 'default')]">{{ entry.tag }}</span>
        </component>
      </div>
    </div>

    <p class="f-note">💡 选择项目方向，查看对应攻略 · 按需投入，量力而行</p>

    <LegalLinks />
    <BackToTop />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'
import BackToTop from '../components/BackToTop.vue'
import { fuyePages } from './fuye-data.js'

// 从 fuyePages 自动生成入口列表
const entries = computed(() => {
  const list = Object.entries(fuyePages)
    .filter(([, page]) => !page.hidden) // 过滤 hidden: true 的子页面
    .map(([slug, page]) => ({
      name: page.title,
      desc: page.subtitle,
      icon: page.cardIcon || '📋',
      url: `/fuye/${slug.replace('fuye/', '')}.html`,
      tag: page.cardTag || '攻略',
      tagType: 'info'
    }))

  // 添加"更多项目"占位
  list.push({
    name: '更多项目',
    desc: '更多项目方向持续更新中',
    icon: '💡',
    url: '',
    tag: '更新中',
    tagType: 'default'
  })

  return list
})

// 动态计算统计数字
const projectCount = computed(() => Object.keys(fuyePages).length)
const guideCount = computed(() =>
  Object.values(fuyePages).reduce((sum, page) => sum + (page.guides?.length || 0), 0)
)
</script>

<style scoped>
.fuye-page{
  width: 100%;
}
.entry-grid {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 最后一项（更多项目）整行通栏展示 */
.entry-grid-item.full-width {
  grid-column: 1 / -1;
}
.entry-grid-item.full-width .entry-card {
  border-style: dashed;
  background: var(--card, #fff);
  justify-content: center;
  text-align: center;
}

.entry-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text, #1a1a2e);
  transition: all 0.2s ease;
}

.entry-card:hover {
  border-color: var(--primary, #FF6B35);
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.1);
  transform: translateY(-1px);
}
.entry-card:active {
  transform: scale(0.98);
}

.entry-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--primary-light, #FFF4ED);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.entry-info {
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

.f-note {
  max-width: 800px;
  margin: 24px auto 48px;
  padding: 0 16px;
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

/* 暗色模式 */
[data-theme="dark"] .entry-card {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}
</style>

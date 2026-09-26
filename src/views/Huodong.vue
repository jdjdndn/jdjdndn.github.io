<template>
  <main class="huodong-page">
      <PageHero
        icon='<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'
        title="券宝"
        subtitle="全网热门活动 · 天天领红包"
        aria="券宝"
      />

      <div class="card">
        <div class="filter-header">
          <span>活动筛选</span>
          <div class="space-h">
            <div class="search-input-wrapper">
              <span class="search-prefix">🔍</span>
              <input
                v-model="searchQuery"
                type="text"
                class="search-input"
                placeholder="搜索活动..."
              />
              <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
            </div>
            <select
              v-model="selectedCategory"
              class="select-input"
            >
              <option value="">全部分类</option>
              <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
        </div>

        <div class="grid-3">
          <div v-for="activity in filteredActivities" :key="activity.id" class="grid-item">
            <div class="card hoverable">
              <div class="card-header">
                <div class="activity-header">
                  <span class="activity-icon">{{ activity.icon }}</span>
                  <span>{{ activity.name }}</span>
                </div>
                <span :class="['tag', 'tag-' + (activity.tagType || 'default')]">
                  {{ activity.tag }}
                </span>
              </div>
              <p class="activity-desc">{{ activity.desc }}</p>
              <div class="space-v">
                <span class="text-muted">
                  活动时间：{{ activity.time }}
                </span>
              </div>
              <div class="card-action">
                <button class="btn btn-primary btn-block" @click="handleJoin(activity)">
                  立即参与
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredActivities.length === 0" class="empty-state">
          <p>没有找到相关活动</p>
        </div>
      </div>

      <LegalLinks />
      <BackToTop />
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../composables'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'
import BackToTop from '../components/BackToTop.vue'

const toast = useToast()
import { featuredActivities } from '../data.js'
const searchQuery = ref('')
const selectedCategory = ref('')

const categoryOptions = [
  { label: '外卖', value: 'food' },
  { label: '购物', value: 'shopping' },
  { label: '出行', value: 'travel' },
  { label: '娱乐', value: 'entertainment' }
]

const activities = ref(featuredActivities)

const filteredActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchSearch = !searchQuery.value ||
      activity.name.includes(searchQuery.value) ||
      activity.desc.includes(searchQuery.value)
    const matchCategory = !selectedCategory.value ||
      activity.category === selectedCategory.value
    return matchSearch && matchCategory
  })
})

function handleJoin(activity) {
  if (!activity.link) {
    message.info('该活动暂无直达链接，敬请期待')
    return
  }
  window.open(activity.link, '_blank', 'noopener')
}
</script>

<style scoped>
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.activity-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.activity-icon {
  font-size: 1.5rem;
}

.activity-desc {
  color: var(--text-secondary, #666);
  margin: 0 0 0.5rem 0;
}

.card {
  background: var(--card-bg, #fff);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid var(--border-color, #e5e7eb);
}

.card.hoverable {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.card.hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-md, rgba(0, 0, 0, 0.1));
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.card-action {
  margin-top: auto;
  padding-top: 0.75rem;
}

.space-h {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.space-v {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: var(--input-bg, #f5f5f5);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  padding: 0 0.75rem;
  flex: 1;
  min-width: 180px;
}

.search-prefix {
  margin-right: 0.5rem;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: var(--text-primary, #333);
  min-width: 0;
}

.search-input::placeholder {
  color: var(--text-muted, #999);
}

.search-clear {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-muted, #999);
  padding: 0.25rem;
  line-height: 1;
}

.search-clear:hover {
  color: var(--text-primary, #333);
}

.select-input {
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  background: var(--input-bg, #f5f5f5);
  font-size: 0.875rem;
  color: var(--text-primary, #333);
  outline: none;
  cursor: pointer;
  appearance: none;
  min-width: 140px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
}

.select-input option {
  padding: 0.5rem 0.75rem;
  background: var(--card-bg, #fff);
  color: var(--text-primary, #333);
}

.select-input:hover {
  border-color: var(--border-hover, #ccc);
}

.select-input:focus {
  border-color: var(--primary-color, #FF6B35);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.grid-3 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
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

.tag {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.tag-default {
  background: var(--tag-default-bg, #f0f0f0);
  color: var(--tag-default-text, #666);
}

.tag-success {
  background: var(--tag-success-bg, #e6f9e6);
  color: var(--tag-success-text, #16a34a);
}

.tag-error {
  background: var(--tag-error-bg, #fde8e8);
  color: var(--tag-error-text, #dc2626);
}

.tag-info {
  background: var(--tag-info-bg, #e8f4fd);
  color: var(--tag-info-text, #2563eb);
}

.tag-warning {
  background: var(--tag-warning-bg, #fef3cd);
  color: var(--tag-warning-text, #d97706);
}

.text-muted {
  font-size: 0.75rem;
  color: var(--text-muted, #999);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.btn:hover {
  opacity: 0.9;
}

.btn-primary {
  background: var(--primary-color, #FF6B35);
  color: #fff;
}

.btn-primary:hover {
  background: var(--primary-hover, #E55A2B);
}

.btn-block {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-muted, #999);
}
</style>

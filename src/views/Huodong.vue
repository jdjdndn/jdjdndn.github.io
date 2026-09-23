<template>
  <main class="huodong-page">
      <PageHero
        icon='<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'
        title="优惠活动聚合"
        subtitle="全网热门活动 · 天天领红包"
        aria="优惠活动聚合"
      />

      <n-card :bordered="false">
        <template #header>
          <div class="filter-header">
            <span>活动筛选</span>
            <n-space>
              <n-input
                v-model:value="searchQuery"
                placeholder="搜索活动..."
                clearable
                size="small"
              >
                <template #prefix>
                  <span>🔍</span>
                </template>
              </n-input>
              <n-select
                v-model:value="selectedCategory"
                :options="categoryOptions"
                placeholder="全部分类"
                size="small"
                clearable
                style="width: 120px"
              />
            </n-space>
          </div>
        </template>

        <n-grid :cols="3" :x-gap="12" :y-gap="12" responsive="screen" item-responsive>
          <n-gi v-for="activity in filteredActivities" :key="activity.id" span="3 m:1">
            <n-card hoverable>
              <template #header>
                <div class="activity-header">
                  <span class="activity-icon">{{ activity.icon }}</span>
                  <span>{{ activity.name }}</span>
                </div>
              </template>
              <template #header-extra>
                <n-tag :type="activity.tagType" size="small">
                  {{ activity.tag }}
                </n-tag>
              </template>
              <p class="activity-desc">{{ activity.desc }}</p>
              <n-space vertical :size="8">
                <n-text depth="3" style="font-size: 12px">
                  活动时间：{{ activity.time }}
                </n-text>

              </n-space>
              <template #action>
                <n-button type="primary" block @click="handleJoin(activity)">
                  立即参与
                </n-button>
              </template>
            </n-card>
          </n-gi>
        </n-grid>

        <n-empty v-if="filteredActivities.length === 0" description="没有找到相关活动" />
      </n-card>

      <LegalLinks />
      <BackToTop />
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMessage } from 'naive-ui'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'
import BackToTop from '../components/BackToTop.vue'

const message = useMessage()
import { featuredActivities } from '../data.js'
const searchQuery = ref('')
const selectedCategory = ref(null)

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
</style>

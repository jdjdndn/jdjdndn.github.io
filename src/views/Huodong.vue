<template>
  <div class="app-wrapper">
    <SiteNav position="side" />
    <div id="app">
      <PageHero
        icon='<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'
        title="优惠活动聚合"
        subtitle="全网热门优惠活动"
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
                <n-text depth="3" style="font-size: 12px">
                  已参与：{{ activity.participants }}人
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

        <n-empty v-if="filteredActivities.length === 0" description="暂无活动" />
      </n-card>

      <LegalLinks />
    </div>
    <SiteNav position="footer" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMessage } from 'naive-ui'
import SiteNav from '../components/SiteNav.vue'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'

const message = useMessage()
const searchQuery = ref('')
const selectedCategory = ref(null)

const categoryOptions = [
  { label: '外卖', value: 'food' },
  { label: '购物', value: 'shopping' },
  { label: '出行', value: 'travel' },
  { label: '娱乐', value: 'entertainment' }
]

const activities = ref([
  { id: 1, icon: '🍔', name: '美团外卖红包', desc: '天天领红包，最高可领66元', time: '长期有效', participants: 12580, tag: '热门', tagType: 'error', category: 'food' },
  { id: 2, icon: '🛒', name: '淘宝闪购', desc: '新客专享最高20元红包', time: '长期有效', participants: 8920, tag: '新客', tagType: 'warning', category: 'shopping' },
  { id: 3, icon: '🚗', name: '滴滴出行券', desc: '打车立减5-10元', time: '7天有效', participants: 5620, tag: '限时', tagType: 'info', category: 'travel' },
  { id: 4, icon: '🎬', name: '电影票优惠', desc: '特价观影，低至19.9元', time: '周末可用', participants: 3240, tag: '周末', tagType: 'success', category: 'entertainment' },
  { id: 5, icon: '☕', name: '瑞幸咖啡', desc: '每周领优惠券', time: '每周更新', participants: 7890, tag: '每周', tagType: 'warning', category: 'food' },
  { id: 6, icon: '📱', name: '京东秒杀', desc: '限时秒杀，超值优惠', time: '每日10点', participants: 15600, tag: '秒杀', tagType: 'error', category: 'shopping' }
])

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
  message.success(`正在跳转到 ${activity.name}...`)
}
</script>

<style scoped>
.app-wrapper {
  display: flex;
  min-height: 100vh;
}

#app {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

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

<template>
  <div class="app-wrapper">
    <!-- 导航 -->
    <SiteNav position="side" />

    <div id="app">
      <!-- 页头 -->
      <PageHero
        icon='<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'
        title="券宝"
        subtitle="外卖 · 出行 · 购物 · 酒旅 · 电影票 · 快递"
        aria="券宝"
      >
        <div id="header-stats"></div>
      </PageHero>

      <!-- 搜索栏 -->
      <n-input-group>
        <n-input
          v-model:value="searchQuery"
          placeholder="搜索入口名称..."
          clearable
          aria-label="搜索优惠"
        >
          <template #prefix>
            <n-icon>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </n-icon>
          </template>
        </n-input>
      </n-input-group>

      <div class="search-count" v-if="searchQuery" aria-live="polite">
        找到 {{ filteredItems.length }} 个结果
      </div>

      <!-- 好物推荐入口 -->
      <n-card class="article-entry-banner" hoverable>
        <router-link to="/article/haowu.html" class="article-entry-link">
          <span class="article-entry-icon" aria-hidden="true">📖</span>
          <span class="article-entry-body">
            <span class="article-entry-title">好物推荐 · 省钱攻略</span>
            <span class="article-entry-sub">美食 / 数码 / 日用 · 亲测真实优惠</span>
          </span>
          <span class="article-entry-arrow" aria-hidden="true">→</span>
        </router-link>
      </n-card>

      <!-- Tab 导航 -->
      <n-tabs v-model:value="activeTab" type="segment" animated>
        <n-tab-pane
          v-for="(tab, index) in tabs"
          :key="tab.name"
          :name="index"
          :tab="`${tab.icon} ${tab.name}`"
        />
      </n-tabs>

      <!-- Tab 内容 -->
      <main id="tab-content" class="tab-content">
        <div v-if="currentTab" class="tab-panel">
          <h2>{{ currentTab.icon }} {{ currentTab.name }}</h2>
          <n-grid :cols="3" :x-gap="12" :y-gap="12" responsive="screen" item-responsive>
            <n-gi
              v-for="item in filteredItems"
              :key="item.id"
              span="3 m:1"
            >
              <n-card class="item-card" hoverable>
                <template #header>
                  <div class="item-header">
                    <span class="item-icon">{{ item.icon }}</span>
                    <span class="item-name">{{ item.name }}</span>
                  </div>
                </template>
                <template #header-extra>
                  <n-tag size="small" type="success">优惠</n-tag>
                </template>
                <p class="item-desc">{{ item.desc }}</p>
                <template #action>
                  <n-button
                    type="primary"
                    block
                    @click="copyCode(item.code)"
                  >
                    {{ copiedId === item.id ? '已复制' : '复制口令' }}
                  </n-button>
                </template>
              </n-card>
            </n-gi>
          </n-grid>
        </div>
      </main>

      <!-- 法律链接 -->
      <LegalLinks />
    </div>

    <!-- 页脚导航 -->
    <SiteNav position="footer" />

    <!-- 回到顶部 -->
    <n-back-top :bottom="80" :right="20" :show-height="300">
      <n-button circle type="primary">
        <template #icon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
        </template>
      </n-button>
    </n-back-top>

    <!-- Toast 提示 -->
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  NInput,
  NInputGroup,
  NInputGroupLabel,
  NCard,
  NTabs,
  NTabPane,
  NGrid,
  NGi,
  NTag,
  NButton,
  NIcon,
  NBackTop,
  NMessageProvider,
  NNotificationProvider,
  NDialogProvider,
  useMessage
} from 'naive-ui'
import SiteNav from '../components/SiteNav.vue'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'

const message = useMessage()

// 数据
const tabs = ref([])
const activeTab = ref(0)
const searchQuery = ref('')
const copiedId = ref(null)

// 计算属性
const currentTab = computed(() => tabs.value[activeTab.value])

const filteredItems = computed(() => {
  if (!currentTab.value) return []
  const items = currentTab.value.items || []
  if (!searchQuery.value) return items

  const query = searchQuery.value.toLowerCase()
  return items.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.desc.toLowerCase().includes(query)
  )
})

// 方法
async function copyCode(code) {
  try {
    await navigator.clipboard.writeText(code)
    copiedId.value = code
    message.success('已复制口令')
    setTimeout(() => {
      copiedId.value = null
    }, 2000)
  } catch (err) {
    message.error('复制失败')
    console.error('复制失败:', err)
  }
}

// 加载数据
async function loadData() {
  try {
    const { loadTabs } = await import('../data.js')
    tabs.value = await loadTabs()
  } catch (err) {
    console.error('加载数据失败:', err)
  }
}

onMounted(() => {
  loadData()
})
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

/* 搜索栏 */
.search-count {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary, #666);
}

/* 好物推荐入口 */
.article-entry-banner {
  margin-bottom: 1.5rem;
}

.article-entry-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.article-entry-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.article-entry-body {
  flex: 1;
}

.article-entry-title {
  font-weight: 600;
  display: block;
}

.article-entry-sub {
  font-size: 0.875rem;
  color: var(--text-secondary, #666);
}

.article-entry-arrow {
  font-size: 1.5rem;
  color: var(--text-secondary, #666);
}

/* Tab 内容 */
.tab-content {
  margin-top: 1rem;
}

.tab-panel h2 {
  margin-bottom: 1rem;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-icon {
  font-size: 1.5rem;
}

.item-name {
  font-weight: 500;
}

.item-desc {
  font-size: 0.875rem;
  color: var(--text-secondary, #666);
  margin: 0;
}
</style>

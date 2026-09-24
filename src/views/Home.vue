<template>
  <main class="home-page">
    <!-- 页头 -->
    <PageHero
      icon='<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'
      title="券宝"
      subtitle="外卖 · 出行 · 购物 · 酒旅 · 电影票 · 快递"
      aria="券宝"
    >
      <div class="hero-stats">
        <span class="stat-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> 精选 <strong>{{ totalCount }}</strong> 个优惠</span>
        <span class="stat-badge">覆盖 <strong>{{ tabs.length }}</strong> 大平台</span>
        <span class="stat-badge freshness-badge"><span class="dot"></span> 每日更新</span>
      </div>
    </PageHero>

    <!-- 搜索栏 -->
    <div class="search-wrapper">
      <div class="search-bar" role="search">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          class="search-input"
          v-model="searchQuery"
          placeholder="搜优惠 / 平台 / 关键词..."
          aria-label="搜索优惠"
          inputmode="search"
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''" aria-label="清除搜索">✕</button>
      </div>
      <div v-if="searchQuery" class="search-count" aria-live="polite">
        找到 {{ filteredItems.length }} 个结果
      </div>
    </div>

    <!-- 好物推荐入口 -->
    <a class="article-entry-banner" href="./article/haowu.html" aria-label="好物推荐省钱攻略文章">
      <span class="article-entry-icon" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span>
      <span class="article-entry-body">
        <span class="article-entry-title">好物推荐 · 省钱攻略</span>
        <span class="article-entry-sub">美食 / 数码 / 日用 · 亲测真实优惠</span>
      </span>
      <span class="article-entry-arrow" aria-hidden="true">→</span>
    </a>

    <!-- Tab 导航 -->
    <nav id="tab-nav" class="tab-nav" role="tablist" aria-label="优惠分类">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === index }]"
        :data-tab="tab.id"
        @click="switchTab(index)"
        role="tab"
        :aria-selected="activeTab === index"
      >
        <span class="tab-label">{{ tab.label }}</span>
        <span class="tab-count">{{ getTabCount(tab) }}</span>
      </button>
    </nav>

    <!-- Tab 内容 -->
    <main id="tab-content" class="tab-content" aria-live="polite" aria-atomic="true">
      <div v-if="currentTab" class="tab-panel">
        <div class="section-header">
          <h2>{{ currentTab.label }}（{{ getTabCount(currentTab) }}）</h2>
        </div>

        <!-- 子 Tab 导航 -->
        <div v-if="currentTab.sections && currentTab.sections.length > 1" class="sub-tab-nav">
          <button
            v-for="section in currentTab.sections"
            :key="section.title"
            :class="['sub-tab-btn', { active: activeSubTab === section.title }]"
            @click="activeSubTab = section.title"
          >
            {{ section.title }}
          </button>
        </div>

        <!-- 卡片列表 -->
        <div class="card-grid">
          <div
            v-for="item in displayItems"
            :key="item.name"
            class="activity-card"
          >
            <div class="card-header">
              <span class="card-name">{{ item.name }}</span>
              <span v-if="item.deadline" class="card-deadline" :class="{ expired: isExpired(item.deadline) }">
                {{ isExpired(item.deadline) ? '已过期' : `截止 ${item.deadline}` }}
              </span>
            </div>
            <p class="card-desc">{{ item.description }}</p>
            <div class="card-actions">
              <button
                v-if="item.code || item.tkl"
                class="btn btn-copy"
                :data-tkl="item.tkl"
                :data-copy="item.code"
                @click="handleCopy(item)"
              >
                复制口令
              </button>
              <button
                v-if="item.link"
                class="btn btn-link"
                @click="openLink(item.link)"
              >
                直接访问
              </button>
              <button
                v-if="item.link"
                class="btn btn-qr"
                @click="showQr(item)"
              >
                二维码
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 数据更新时间 -->
    <div class="last-updated">
      数据更新于 {{ currentDate }}
    </div>

    <!-- SEO 内链：省钱攻略汇总页 -->
    <a href="./article/index.html" class="seo-hidden-link" aria-hidden="true" tabindex="-1">省钱攻略大全</a>

    <!-- 法律链接 -->
    <LegalLinks />

    <!-- 二维码弹窗 -->
    <QrModal
      v-if="qrItem"
      :visible="true"
      :url="qrItem.link"
      :title="qrItem.name"
      @close="closeQr"
    />

    <!-- 回到顶部按钮 -->
    <button
      v-show="showBackToTop"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="回到顶部"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'
import QrModal from '../components/QrModal.vue'
import { tabs } from '../data.js'
import { isExpired } from '../common/utils.js'
import { useToast } from '../composables'

// 数据
const activeTab = ref(0)
const activeSubTab = ref('')
const searchQuery = ref('')
const showBackToTop = ref(false)
const qrItem = ref(null)
const toast = useToast()

// 计算属性
const currentTab = computed(() => tabs[activeTab.value])

const totalCount = computed(() => {
  return tabs.reduce((count, tab) => {
    return count + (tab.sections || []).reduce((sectionCount, section) => {
      return sectionCount + (section.items || []).length
    }, 0)
  }, 0)
})

const displayItems = computed(() => {
  if (!currentTab.value) return []

  let items = []
  if (activeSubTab.value && currentTab.value.sections) {
    const section = currentTab.value.sections.find(s => s.title === activeSubTab.value)
    items = section ? (section.items || []) : []
  } else if (currentTab.value.sections && currentTab.value.sections.length > 0) {
    items = currentTab.value.sections[0].items || []
  }

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
    )
  }

  return items
})

const filteredItems = computed(() => displayItems.value)

const currentDate = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
})

// 方法
function getTabCount(tab) {
  return (tab.sections || []).reduce((count, section) => {
    return count + (section.items || []).length
  }, 0)
}

function switchTab(index) {
  activeTab.value = index
  // 重置子 tab
  if (currentTab.value && currentTab.value.sections && currentTab.value.sections.length > 0) {
    activeSubTab.value = currentTab.value.sections[0].title
  } else {
    activeSubTab.value = ''
  }
  // 保存到 localStorage
  localStorage.setItem('activeTab', currentTab.value.id)
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
  // 让激活的 tab 按钮滚入可视区
  nextTick(() => {
    const activeBtn = document.querySelector('.tab-btn.active')
    if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  })
}

function openLink(url) {
  window.open(url, '_blank', 'noopener')
}

function showQr(item) {
  qrItem.value = item
}

function closeQr() {
  qrItem.value = null
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleCopy(item) {
  const text = item.tkl || item.code || ''
  if (!text) return

  try {
    await navigator.clipboard.writeText(text)
    toast.show('已复制')
  } catch (err) {
    toast.show('复制失败')
    console.error('复制失败:', err)
  }
}

// 滚动监听
function handleScroll() {
  showBackToTop.value = window.scrollY > 300
}

onMounted(() => {
  // 初始化 tab
  const savedTab = localStorage.getItem('activeTab')
  if (savedTab) {
    const index = tabs.findIndex(t => t.id === savedTab)
    if (index !== -1) {
      activeTab.value = index
    }
  }

  // 初始化子 tab
  if (currentTab.value && currentTab.value.sections && currentTab.value.sections.length > 0) {
    activeSubTab.value = currentTab.value.sections[0].title
  }

  // 监听滚动
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home-page {
  width: 100%;
  padding: 0;
  position: relative;
}

/* 搜索栏 */
.search-wrapper {
  margin-bottom: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--card, #ffffff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 999px;
  transition: border-color 0.2s ease, box-shadow 0.3s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));
}

.search-bar:focus-within {
  border-color: var(--primary, #FF6B35);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.12);
}

.search-icon {
  color: var(--muted, #6b7280);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--text, #1a1a2e);
  outline: none;
}

.search-input::placeholder {
  color: var(--placeholder, #b0aaa0);
}

.search-clear {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--hover-bg, #f5f4f1);
  border-radius: 50%;
  cursor: pointer;
  color: var(--muted, #6b7280);
  font-size: 12px;
  transition: background-color 0.2s, color 0.2s;
}

.search-clear:hover {
  background: var(--border, #e5e2dd);
  color: var(--text, #1a1a2e);
}

.search-count {
  margin-top: 8px;
  font-size: 13px;
  color: var(--muted, #6b7280);
}

/* 好物推荐入口 */
.article-entry-banner {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 16px;
  background: var(--card, #ffffff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: var(--radius, 12px);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.25s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)),
              box-shadow 0.25s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)),
              transform 0.25s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));
}

.article-entry-banner:hover {
  border-color: var(--primary, #FF6B35);
  box-shadow: var(--shadow-hover);
  transform: translateY(-1px);
}

.article-entry-icon {
  font-size: 2rem;
  margin-right: 12px;
}

.article-entry-body {
  flex: 1;
}

.article-entry-title {
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.article-entry-sub {
  font-size: 13px;
  color: var(--muted, #6b7280);
}

.article-entry-arrow {
  font-size: 1.5rem;
  color: var(--muted, #6b7280);
}

.hero-stats{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

/* Tab 导航 */
.tab-nav {
  display: flex;
  gap: 8px;
  padding: 4px;
  margin-bottom: 16px;
  background: var(--card, #ffffff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: var(--radius, 12px);
  overflow-x: auto;
  scrollbar-width: none;
}

.tab-nav::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm, 8px);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary, #4a5568);
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.tab-btn:hover:not(.active) {
  background: var(--hover-bg, #f5f4f1);
}

.tab-btn.active {
  background: var(--primary, #FF6B35);
  color: #fff;
}

.tab-count {
  font-size: 11px;
  padding: 2px 6px;
  background: var(--border-light, #f0eeeb);
  border-radius: 10px;
  color: var(--muted, #6b7280);
  font-weight: 600;
}

.tab-btn.active .tab-count {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

/* 子 Tab 导航 */
.sub-tab-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding: 4px;
  background: var(--bg-elevated, #fcfbf9);
  border-radius: var(--radius-sm, 8px);
  overflow-x: auto;
  scrollbar-width: none;
}

.sub-tab-nav::-webkit-scrollbar {
  display: none;
}

.sub-tab-btn {
  padding: 6px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary, #4a5568);
  white-space: nowrap;
  transition: background-color 0.2s, color 0.2s;
}

.sub-tab-btn:hover:not(.active) {
  background: var(--card, #ffffff);
}

.sub-tab-btn.active {
  background: var(--card, #ffffff);
  color: var(--primary, #FF6B35);
  box-shadow: var(--shadow-xs);
}

/* 卡片网格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

/* 活动卡片 */
.activity-card {
  background: var(--card, #ffffff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: var(--radius, 12px);
  padding: 18px;
  transition: border-color 0.25s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)),
              box-shadow 0.25s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)),
              transform 0.25s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));
  display: flex;
  flex-direction: column;
}

.activity-card:hover {
  border-color: var(--primary, #FF6B35);
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-name {
  font-weight: 700;
  font-size: 14px;
  color: var(--text, #1a1a2e);
  letter-spacing: 0.01em;
}

.card-deadline {
  font-size: 12px;
  color: var(--muted, #6b7280);
}

.card-deadline.expired {
  color: var(--danger, #DC2626);
}

.card-desc {
  font-size: 13px;
  color: var(--text-secondary, #4a5568);
  line-height: 1.5;
  margin-bottom: 12px;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--border-light, #f0eeeb);
}

.card-actions button {
  flex: 1;
  min-width: 0;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn:active {
  transform: scale(0.97);
}

.btn-copy {
  background: var(--primary, #FF6B35);
  color: white;
}

.btn-copy:hover {
  background: var(--primary-hover, #E55A2B);
}

.btn-link {
  background: var(--hover-bg, #f5f4f1);
  color: var(--text, #1a1a2e);
}

.btn-link:hover {
  background: var(--border, #e5e2dd);
}

.btn-qr {
  background: var(--hover-bg, #f5f4f1);
  color: var(--text, #1a1a2e);
}

.btn-qr:hover {
  background: var(--border, #e5e2dd);
}

/* 数据更新时间 */
.last-updated {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: var(--muted, #6b7280);
}

/* 回到顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: var(--primary, #FF6B35);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  z-index: 99;
  transition: opacity 0.2s, transform 0.2s;
}

.back-to-top:hover {
  transform: scale(1.1);
}

/* 暗色模式 */
[data-theme="dark"] .search-bar {
  background: var(--card, #1a1f36);
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .article-entry-banner {
  background: var(--card, #1a1f36);
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .tab-nav {
  background: var(--card, #1a1f36);
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .sub-tab-nav {
  background: var(--bg-elevated, #1a1a2e);
}

[data-theme="dark"] .sub-tab-btn:hover:not(.active) {
  background: var(--card, #1a1f36);
}

[data-theme="dark"] .sub-tab-btn.active {
  background: var(--card, #1a1f36);
}

[data-theme="dark"] .activity-card {
  background: var(--card, #1a1f36);
  border-color: var(--border, #2d2d45);
}

/* 响应式 */
@media (max-width: 480px) {
  .tab-btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* SEO 隐藏链接：对用户不可见，但搜索引擎可爬取 */
.seo-hidden-link {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

<template>
  <main class="haoka-page">
    <PageHero
      icon='<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>'
      title="号卡代理专区"
      subtitle="官方渠道办理 · 卡品信息仅供了解"
      aria="号卡代理专区"
    >
      <span class="stat-badge"><strong>官方渠道</strong> · 号卡在线办理</span>
    </PageHero>

    <!-- 新规提示 -->
    <div class="haoka-notice" role="alert">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        style="vertical-align: -2px; flex-shrink: 0"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      官方渠道均可在线申请号卡，信息仅供参考，办理前请以运营商官方页面为准。
    </div>
    <!-- 信任徽章 -->
    <div class="trust-bar" role="list" aria-label="服务保障">
      <span class="trust-item" role="listitem">✓ 运营商授权</span>
      <span class="trust-item" role="listitem">✓ 多地区可选</span>
      <span class="trust-item" role="listitem">✓ 正规实名办理</span>
      <span class="trust-item" role="listitem">✓ 需年满18周岁</span>
    </div>

    <!-- 充话费提示 -->
    <!-- <div class="recharge-banner" role="alert">
      <span class="recharge-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
      <div class="recharge-text">
        <strong>充话费 95 折</strong>
        <span>微信咨询 · 不到账全额退</span>
      </div>
      <button class="recharge-btn" @click="copyWechat">加微信</button>
    </div> -->

    <!-- 跨页面推荐 -->
    <div class="cross-link-banner">
      <span>需要便携上网设备？随身WiFi <strong>39元/月起</strong></span>
      <router-link to="/wifi.html">去看看 →</router-link>
    </div>

    <!-- 选卡指南入口 -->
    <div class="hero-entry-banner">
      <div class="hero-entry-text">
        <span class="hero-entry-icon" aria-hidden="true"
          ><svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg
        ></span>
        <div>
          <strong>选卡指南 · 运营商对比 · 常见问题</strong>
          <span>帮你选到最合适的号卡</span>
        </div>
      </div>
      <router-link to="/haoka-hero.html" class="hero-entry-link">查看详情 →</router-link>
    </div>

    <!-- 号卡代理横幅 -->
    <div class="haoka-agent-banner" @click="showHaokaLinks = !showHaokaLinks">
      <div class="haoka-agent-banner-text">
        <span class="haoka-agent-banner-icon">📱</span>
        <div>
          <strong>号卡链接</strong>
          <span>{{ showHaokaLinks ? '点击收起' : '点击查看全部号卡入口' }}</span>
        </div>
      </div>
      <span class="haoka-agent-banner-arrow">{{ showHaokaLinks ? '▲' : '▼' }}</span>
    </div>

    <!-- 号卡代理链接列表 -->
    <div v-if="showHaokaLinks" class="haoka-links-grid">
      <a
        v-for="link in haokaLinks"
        :key="link.name"
        :href="link.url"
        target="_blank"
        rel="noopener sponsored"
        class="haoka-link-card"
      >
        <div class="haoka-link-header">
          <span class="haoka-link-name">{{ link.name }}</span>
          <span class="haoka-link-badge">{{ link.badge }}</span>
        </div>
        <div class="haoka-link-desc">{{ link.description }}</div>
        <div class="haoka-link-meta">
          <span class="haoka-link-price">{{ link.priceRange }}</span>
          <span v-if="link.nationwide" class="haoka-link-tag">全国</span>
        </div>
      </a>
    </div>

    <!-- 号卡文章列表 -->
    <div class="container">
      <!-- 搜索框 -->
      <SearchBox v-model="searchKeyword" placeholder="搜索号卡标题或描述..." class="haoka-search" />

      <!-- Tab 切换 -->
      <div class="tab-nav">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-btn"
          :class="{ active: currentTab === tab.value }"
          @click="switchTab(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 文章列表 -->
      <div v-if="filteredArticles.length > 0" class="article-grid">
        <a v-for="item in pagedArticles" :key="item.title" :href="item.url" class="article-card">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <span class="tag">{{ item.tag }}</span>
        </a>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
        <p>未找到相关文章</p>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">上一页</button>
        <template v-for="page in displayPages" :key="page">
          <span v-if="page === '...'" class="page-info">...</span>
          <button v-else :class="{ active: page === currentPage }" @click="goToPage(page)">
            {{ page }}
          </button>
        </template>
        <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">下一页</button>
        <span class="page-info">共 {{ filteredArticles.length }} 篇</span>
      </div>
    </div>

    <LegalLinks />
    <BackToTop />
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast, usePagination } from '../composables'
import PageHero from '../components/PageHero.vue'
import SearchBox from '../components/SearchBox.vue'
import LegalLinks from '../components/LegalLinks.vue'
import BackToTop from '../components/BackToTop.vue'
import { haokaLinks } from '../templates/haoka-data.js'
import { articles } from './haoka/articles-data.js'

const showHaokaLinks = ref(true)

const toast = useToast()

// 运营商 Tab
const tabs = [
  { label: '全部', value: 'all' },
  { label: '移动', value: '移动' },
  { label: '联通', value: '联通' },
  { label: '电信', value: '电信' },
  { label: '广电', value: '广电' },
  // { label: '指南', value: '指南' }
]

const currentTab = ref('all')
const searchKeyword = ref('')

// 文章数据

// 筛选后的文章
const filteredArticles = computed(() => {
  const keyword = searchKeyword.value.toLowerCase()
  return articles.filter((item) => {
    const matchTab = currentTab.value === 'all' || item.carrier === currentTab.value
    const matchSearch =
      !keyword || item.title.toLowerCase().includes(keyword) || item.desc.toLowerCase().includes(keyword)
    return matchTab && matchSearch
  })
})

const {
  currentPage,
  totalPages,
  pagedList: pagedArticles,
  displayPages,
  goToPage: _goToPage,
  resetPage,
} = usePagination(filteredArticles, { maxVisible: 7 })

const goToPage = (page) => {
  _goToPage(page)
}

// 切换 Tab
const switchTab = (tab) => {
  currentTab.value = tab
  resetPage()
}

// 搜索关键词变化时重置页码
watch(searchKeyword, resetPage)

function copyWechat() {
  navigator.clipboard
    .writeText('wcbblll')
    .then(() => {
      toast.show('微信号 wcbblll 已复制，打开微信搜索添加')
    })
    .catch(() => {
      toast.show('复制失败，请手动搜索微信号：wcbblll')
    })
}
</script>

<style scoped>
.haoka-page {
  width: 100%;
}

.haoka-notice {
  max-width: 960px;
  margin: 14px auto 0;
  padding: 10px 14px;
  border-radius: 8px;
  background: #fff3e6;
  color: #8a4b0a;
  font-size: 13px;
  line-height: 1.6;
  border: 1px solid #ffd9a8;
}
.trust-bar {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 20px;
  padding: 12px 16px;
}

.trust-item {
  font-size: 13px;
  color: var(--success, #16a34a);
}

/* 充话费横幅 */
.recharge-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 1100px;
  margin: 24px auto;
  padding: 14px 20px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #f59e0b;
  border-radius: 12px;
}

.recharge-icon {
  font-size: 28px;
}

.recharge-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recharge-text strong {
  font-size: 15px;
  color: #92400e;
}
.recharge-text span {
  font-size: 12px;
  color: #a16207;
}

.recharge-btn {
  padding: 8px 16px;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
}

/* 跨页面推荐 */
.cross-link-banner {
  max-width: 1100px;
  margin: 24px auto;
  padding: 14px 20px;
  background: var(--accent-light, #ebf5ff);
  border: 1px solid var(--accent, #004e89);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.cross-link-banner a {
  color: var(--accent, #004e89);
  font-weight: 600;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 8px;
  background: rgba(0, 78, 137, 0.08);
  transition: background 0.2s;
}
.cross-link-banner a:hover {
  background: rgba(0, 78, 137, 0.15);
}
.cross-link-banner a:active {
  transform: scale(0.97);
}

/* 号卡代理横幅 */
.haoka-agent-banner {
  max-width: 1100px;
  margin: 16px auto;
  padding: 14px 20px;
  background: linear-gradient(135deg, #e8f5e9 0%, #fff 100%);
  border: 1px solid #4caf50;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s;
}
.haoka-agent-banner:hover {
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
  transform: translateY(-1px);
}
.haoka-agent-banner-text {
  display: flex;
  align-items: center;
  gap: 12px;
}
.haoka-agent-banner-icon {
  font-size: 28px;
}
.haoka-agent-banner-text strong {
  display: block;
  font-size: 15px;
  color: #1a1a2e;
}
.haoka-agent-banner-text span {
  font-size: 12px;
  color: #6b7280;
}
.haoka-agent-banner-arrow {
  font-size: 14px;
  color: #4caf50;
  font-weight: 600;
}

/* 号卡代理链接列表 */
.haoka-links-grid {
  max-width: 1100px;
  margin: 0 auto 24px;
  padding: 0 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}
.haoka-link-card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
  padding: 16px;
  text-decoration: none;
  color: var(--text, #1a1a2e);
  transition: all 0.2s;
}
.haoka-link-card:hover {
  border-color: #4caf50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
  transform: translateY(-2px);
}
.haoka-link-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.haoka-link-name {
  font-size: 15px;
  font-weight: 600;
}
.haoka-link-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  background: #e8f5e9;
  color: #2e7d32;
}
.haoka-link-desc {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.5;
  margin-bottom: 8px;
}
.haoka-link-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}
.haoka-link-price {
  font-size: 13px;
  font-weight: 600;
  color: #4caf50;
}
.haoka-link-tag {
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 11px;
  background: #e3f2fd;
  color: #1565c0;
}

/* 选卡指南入口 */
.hero-entry-banner {
  max-width: 1100px;
  margin: 24px auto;
  padding: 14px 20px;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border: 1px solid #fb923c;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero-entry-text {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.hero-entry-icon {
  font-size: 28px;
}

.hero-entry-text strong {
  display: block;
  font-size: 15px;
}
.hero-entry-text span {
  font-size: 12px;
  color: #9a3412;
}

.hero-entry-link {
  color: #c2410c;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  padding: 6px 14px;
  border-radius: 8px;
  background: rgba(194, 65, 12, 0.08);
  transition: background 0.2s;
}
.hero-entry-link:hover {
  background: rgba(194, 65, 12, 0.15);
}
.hero-entry-link:active {
  transform: scale(0.97);
}

[data-theme='dark'] .hero-entry-banner {
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(251, 146, 60, 0.08));
  border-color: rgba(251, 146, 60, 0.4);
}

/* SEO 区域 */
.seo-section {
  max-width: 1100px;
  margin: 32px auto;
  padding: 0 16px;
}

.seo-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.guide-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
}

.guide-step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-light, #fff4ed);
  color: var(--primary, #ff6b35);
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.guide-content h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}
.guide-content p {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
  margin: 0;
}

.seo-note {
  font-size: 12px;
  color: var(--muted, #6b7280);
  margin-top: 10px;
}

/* 暗色模式 */
[data-theme='dark'] .guide-card {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}

[data-theme='dark'] .haoka-agent-banner {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(76, 175, 80, 0.08));
  border-color: rgba(76, 175, 80, 0.4);
}
[data-theme='dark'] .haoka-link-card {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}

[data-theme='dark'] .recharge-banner {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.08));
}

/* 文章列表 */
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 48px;
}

.haoka-search {
  max-width: 480px;
  margin: 24px auto 20px;
}

/* Tab 切换 */
.tab-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.tab-nav::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  flex-shrink: 0;
  padding: 8px 20px;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 20px;
  background: var(--card, #fff);
  color: var(--text, #1a1a2e);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  border-color: var(--primary, #ff6b35);
  color: var(--primary, #ff6b35);
}

.tab-btn.active {
  background: var(--primary, #ff6b35);
  color: #fff;
  border-color: var(--primary, #ff6b35);
}

/* 文章卡片 */
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.article-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text, #1a1a2e);
  transition: all 0.2s ease;
}

.article-card:hover {
  border-color: var(--primary, #ff6b35);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.article-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
}

.article-card p {
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.5;
  flex: 1;
  margin-bottom: 12px;
}

.tag {
  display: inline-block;
  padding: 4px 10px;
  background: var(--primary-light, #eef2ff);
  color: var(--primary, #ff6b35);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  align-self: flex-start;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary, #9ca3af);
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 8px;
  background: var(--card, #fff);
  color: var(--text, #1a1a2e);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination button:hover:not(:disabled) {
  border-color: var(--primary, #ff6b35);
  color: var(--primary, #ff6b35);
}

.pagination button.active {
  background: var(--primary, #ff6b35);
  color: #fff;
  border-color: var(--primary, #ff6b35);
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  padding: 0 4px;
  color: var(--text-secondary, #9ca3af);
  font-size: 14px;
}

/* 暗色模式 */
[data-theme='dark'] .article-card {
  background: rgba(31, 41, 55, 0.5);
  border-color: rgba(75, 85, 99, 0.5);
}

[data-theme='dark'] .article-card:hover {
  border-color: var(--primary, #ff6b35);
  box-shadow: 0 4px 12px rgba(129, 140, 248, 0.15);
}

[data-theme='dark'] .tag {
  background: rgba(99, 102, 241, 0.15);
}

[data-theme='dark'] .pagination button {
  background: rgba(31, 41, 55, 0.5);
  border-color: rgba(75, 85, 99, 0.5);
  color: #f3f4f6;
}

@media (max-width: 640px) {
  .article-grid {
    grid-template-columns: 1fr;
  }
}
</style>

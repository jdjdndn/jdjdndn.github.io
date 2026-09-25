<template>
  <main class="creditcard-page">
    <PageHero
      icon='<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>'
      title="信用卡申请专区"
      subtitle="多家银行信用卡 · 申请入口汇总"
      aria="信用卡申请专区"
    >
      <span class="stat-badge">多家银行信用卡</span>
      <span class="stat-badge"><strong>0</strong> 元申请</span>
    </PageHero>

    <!-- 代理入口横幅 -->
    <!-- <div class="agent-banner">
      <div class="agent-banner-text">
        <span class="agent-banner-icon">💳</span>
        <div>
          <strong>信用卡代理推广</strong>
          <span>用户通过你的链接申请并激活，你赚佣金</span>
        </div>
      </div>
      <router-link to="/fuye/xinyongka.html" class="agent-banner-link">查看代理入口 →</router-link>
    </div> -->

    <!-- 三大代理平台 -->
    <!-- <div class="platform-grid">
      <a href="https://w1.kahe.cn/qrcodeActivity?cardcode=R8863SGK&invitation=JY8ZFYSR&is_help=2&proportion=10" target="_blank" rel="noopener sponsored" class="platform-card">
        <div class="platform-icon">🏦</div>
        <div class="platform-name">卡盒</div>
        <div class="platform-desc">高额返佣 · 批核快</div>
      </a>
      <a href="https://i.ws101.cn/#/appRegistered?u=87949&r=100" target="_blank" rel="noopener sponsored" class="platform-card">
        <div class="platform-icon">🏦</div>
        <div class="platform-name">掌上推卡</div>
        <div class="platform-desc">门槛低 · 通过率高</div>
      </a>
      <a href="https://sstk.kakayuy.net/static/#/appRegistered?u=43209&r=100" target="_blank" rel="noopener sponsored" class="platform-card">
        <div class="platform-icon">🏦</div>
        <div class="platform-name">随手推卡</div>
        <div class="platform-desc">新户礼丰厚</div>
      </a>
    </div> -->

    <!-- 文章列表 -->
    <div class="container">
      <SearchBox
        v-model="searchKeyword"
        placeholder="搜索信用卡文章..."
        class="cc-search"
      />

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

      <div v-if="filteredArticles.length > 0" class="article-grid">
        <a
          v-for="item in pagedArticles"
          :key="item.title"
          :href="item.url"
          class="article-card"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <span class="tag">{{ item.tag }}</span>
        </a>
      </div>

      <div v-else class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
        <p>未找到相关文章</p>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">上一页</button>
        <template v-for="page in displayPages" :key="page">
          <span v-if="page === '...'" class="page-info">...</span>
          <button
            v-else
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          >
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
import PageHero from '../components/PageHero.vue'
import SearchBox from '../components/SearchBox.vue'
import LegalLinks from '../components/LegalLinks.vue'
import BackToTop from '../components/BackToTop.vue'
import { usePagination } from '../composables'

const tabs = [
  { label: '全部', value: 'all' },
  { label: '银行', value: '银行' }
]

const currentTab = ref('all')
const searchKeyword = ref('')

// 信用卡文章列表
const articles = [
  { title: '中信银行信用卡 · 首刷版', desc: '新户首刷享好礼，多种卡面可选，快速审批', tag: '银行', url: '/article/creditcard-zhongxin.html' },
  { title: '招商银行信用卡 · 双绑版', desc: '微信+支付宝双绑定享优惠，新户礼丰厚', tag: '银行', url: '/article/creditcard-zhaoshang.html' },
  { title: '平安银行信用卡 · 首刷版', desc: '新户首刷享好礼，加油返现优惠', tag: '银行', url: '/article/creditcard-pingan.html' },
  { title: '交通银行信用卡 · 首刷版', desc: '最红星期五优惠，新户首刷享好礼', tag: '银行', url: '/article/creditcard-jiaotong.html' },
  { title: '光大银行信用卡', desc: '阳光财富积分，多种卡面可选', tag: '银行', url: '/article/creditcard-guangda.html' },
  { title: '南京银行信用卡', desc: '本地优惠丰富，新户礼遇', tag: '银行', url: '/article/creditcard-nanjing.html' },
  { title: '蒙商银行信用卡', desc: '内蒙古地区特色优惠，新户礼遇', tag: '银行', url: '/article/creditcard-mengshang.html' },
  { title: '广发银行信用卡', desc: '积分兑换丰富，多种卡面可选', tag: '银行', url: '/article/creditcard-guangfa.html' },
  { title: '中国农业银行信用卡', desc: '国有大行，网点覆盖广，权益实在', tag: '银行', url: '/article/creditcard-abc.html' },
  { title: '交通银行信用卡 · 卡盒渠道', desc: '最红星期五优惠（卡盒渠道）', tag: '银行', url: '/article/creditcard-jiaotong-kahe.html' },
  { title: '浦发银行运通卡金卡', desc: '美国运通权益，高端卡面', tag: '银行', url: '/article/creditcard-pufa-amex.html' },
]

const filteredArticles = computed(() => {
  let list = articles
  if (currentTab.value !== 'all') {
    list = list.filter(a => a.tag === currentTab.value)
  }
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(a => a.title.toLowerCase().includes(kw) || a.desc.toLowerCase().includes(kw))
  }
  return list
})

const { currentPage, totalPages, pagedList: pagedArticles, displayPages, goToPage, resetPage } = usePagination(filteredArticles)

function switchTab(value) {
  currentTab.value = value
  resetPage()
}

watch(searchKeyword, resetPage)
</script>

<style scoped>
.creditcard-page { width: 100%; }

/* 代理入口横幅 */
.agent-banner {
  max-width: 800px;
  margin: 24px auto;
  padding: 16px 20px;
  background: linear-gradient(135deg, var(--primary-light, #fff7ed) 0%, #fff 100%);
  border: 1px solid var(--primary, #FF6B35);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.agent-banner-text {
  display: flex;
  align-items: center;
  gap: 12px;
}
.agent-banner-icon { font-size: 28px; }
.agent-banner-text strong { display: block; font-size: 15px; color: var(--text, #1a1a2e); }
.agent-banner-text span { font-size: 12px; color: var(--text-secondary, #6b7280); }
.agent-banner-link {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary, #FF6B35);
  text-decoration: none;
  white-space: nowrap;
}
.agent-banner-link:hover { text-decoration: underline; }

/* 三大平台卡片 */
.platform-grid {
  max-width: 800px;
  margin: 0 auto 32px;
  padding: 0 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.platform-card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  color: var(--text, #1a1a2e);
  transition: all .2s;
}
.platform-card:hover {
  border-color: var(--primary, #FF6B35);
  box-shadow: 0 4px 12px rgba(255, 107, 53, .1);
  transform: translateY(-2px);
}
.platform-icon { font-size: 28px; margin-bottom: 8px; }
.platform-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.platform-desc { font-size: 12px; color: var(--text-secondary, #6b7280); }

/* 文章列表 */
.container { max-width: 800px; margin: 0 auto; padding: 0 16px; }
.cc-search { margin-bottom: 16px; }

.tab-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.tab-btn {
  padding: 8px 16px;
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 20px;
  background: var(--card, #fff);
  color: var(--text-secondary, #6b7280);
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: all .2s;
}
.tab-btn.active {
  background: var(--primary, #FF6B35);
  color: #fff;
  border-color: var(--primary, #FF6B35);
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}
.article-card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
  padding: 20px;
  text-decoration: none;
  color: var(--text, #1a1a2e);
  transition: all .2s;
}
.article-card:hover {
  border-color: var(--primary, #FF6B35);
  box-shadow: 0 4px 12px rgba(255, 107, 53, .1);
  transform: translateY(-2px);
}
.article-card h3 { font-size: 15px; font-weight: 600; margin: 0 0 6px; }
.article-card p { font-size: 13px; color: var(--text-secondary, #6b7280); margin: 0 0 10px; line-height: 1.5; }
.article-card .tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  background: var(--primary-light, #FFF4ED);
  color: var(--primary, #FF6B35);
}

.empty-state { text-align: center; padding: 48px 0; color: var(--text-secondary, #6b7280); }

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 32px 0;
  flex-wrap: wrap;
}
.pagination button {
  padding: 8px 14px;
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 8px;
  background: var(--card, #fff);
  color: var(--text, #1a1a2e);
  cursor: pointer;
  font-size: 14px;
  transition: all .2s;
}
.pagination button:hover { border-color: var(--primary, #FF6B35); color: var(--primary, #FF6B35); }
.pagination button.active { background: var(--primary, #FF6B35); color: #fff; border-color: var(--primary, #FF6B35); }
.pagination button:disabled { opacity: .4; cursor: not-allowed; }
.page-info { font-size: 13px; color: var(--text-secondary, #6b7280); }

@media (max-width: 640px) {
  .agent-banner { flex-direction: column; text-align: center; }
  .platform-grid { grid-template-columns: 1fr; }
  .article-grid { grid-template-columns: 1fr; }
}
</style>

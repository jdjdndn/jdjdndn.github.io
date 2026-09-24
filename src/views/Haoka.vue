<template>
  <main class="haoka-page">
    <PageHero
      icon='<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>'
      title="号卡业务专区"
      subtitle="官方渠道办理 · 卡品信息仅供了解"
      aria="号卡业务专区"
    >
      <span class="stat-badge"><strong>官方渠道</strong> · 号卡在线办理</span>
    </PageHero>

    <!-- 新规提示 -->  <div class="haoka-notice" role="alert"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px;flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> 官方渠道均可在线申请号卡，信息仅供参考，办理前请以运营商官方页面为准。</div> <!-- 信任徽章 -->
    <div class="trust-bar" role="list" aria-label="服务保障">
      <span class="trust-item" role="listitem">✓ 运营商授权</span>
      <span class="trust-item" role="listitem">✓ 多地区可选</span>
      <span class="trust-item" role="listitem">✓ 正规实名办理</span>
      <span class="trust-item" role="listitem">✓ 需年满18周岁</span>
    </div>

    <!-- 充话费提示 -->
    <div class="recharge-banner" role="alert">
      <span class="recharge-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
      <div class="recharge-text">
        <strong>充话费 95 折</strong>
        <span>微信咨询 · 不到账全额退</span>
      </div>
      <button class="recharge-btn" @click="copyWechat">加微信</button>
    </div>

     <!-- 跨页面推荐 -->
    <div class="cross-link-banner">
      <span>需要便携上网设备？随身WiFi <strong>39元/月起</strong></span>
      <router-link to="/wifi.html">去看看 →</router-link>
    </div>

    <!-- 选卡指南入口 -->
    <div class="hero-entry-banner">
      <div class="hero-entry-text">
        <span class="hero-entry-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span>
        <div>
          <strong>选卡指南 · 运营商对比 · 常见问题</strong>
          <span>帮你选到最合适的号卡</span>
        </div>
      </div>
      <router-link to="/haoka-hero.html" class="hero-entry-link">查看详情 →</router-link>
    </div>

    <!-- 号卡文章列表 -->
    <div class="container">
      <!-- 搜索框 -->
      <SearchBox
        v-model="searchKeyword"
        placeholder="搜索文章标题或描述..."
        class="haoka-search"
      />

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

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
        <p>未找到相关文章</p>
      </div>

      <!-- 分页 -->
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
import { useToast } from '../composables'
import PageHero from '../components/PageHero.vue'
import SearchBox from '../components/SearchBox.vue'
import LegalLinks from '../components/LegalLinks.vue'
import BackToTop from '../components/BackToTop.vue'

const toast = useToast()

// 运营商 Tab
const tabs = [
  { label: '全部', value: 'all' },
  { label: '移动', value: '移动' },
  { label: '联通', value: '联通' },
  { label: '电信', value: '电信' },
  { label: '广电', value: '广电' }
]

const currentTab = ref('all')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = 9

// 文章数据
const articles = [
  // 移动
  { title: '中国移动福气卡', desc: '39元240G+2000分钟，福建五城专属。', url: '/article/card/fuqi-card.html', tag: '39元240G', carrier: '移动' },
  { title: '中国移动黄鹤卡', desc: '39元150G流量，仅发湖北七城。', url: '/article/card/huanghe-card.html', tag: '39元150G', carrier: '移动' },
  { title: '中国移动庐州卡', desc: '39元160G+100分钟+100短信。', url: '/article/card/luzhou-card.html', tag: '39元160G', carrier: '移动' },
  { title: '中国移动水仙卡', desc: '29元230G+500分钟，福建五城专属。', url: '/article/card/shuixian-card.html', tag: '29元230G', carrier: '移动' },
  { title: '中国移动知意卡', desc: '39元55G通用流量，48个月合约。', url: '/article/card/zhiyi-card.html', tag: '39元55G', carrier: '移动' },
  // 联通
  { title: '中国联通大尧卡', desc: '39元180G+200分钟，12个月优惠期。', url: '/article/card/dayao-card.html', tag: '39元180G', carrier: '联通' },
  { title: '中国联通长汀卡', desc: '首月49元370G，江西专属。', url: '/article/card/changting-card.html', tag: '370G', carrier: '联通' },
  { title: '中国联通飞驰卡', desc: '39元200G+300分钟，先激活后发货。', url: '/article/card/feichi2-card.html', tag: '39元200G', carrier: '联通' },
  { title: '中国联通飞辰卡', desc: '39元155G+100分钟，赠360G/年。', url: '/article/card/feichen-card.html', tag: '39元155G', carrier: '联通' },
  { title: '中国联通方圆卡', desc: '39元240G+200分钟，长期套餐。', url: '/article/card/fangyuan-card.html', tag: '39元240G', carrier: '联通' },
  { title: '中国联通飞雀卡', desc: '39元150G+200分钟，赠4年会员。', url: '/article/card/feique-card.html', tag: '39元150G', carrier: '联通' },
  { title: '联通定瓷卡', desc: '39元200G+200分钟，可发全国。', url: '/article/card/dingci-card.html', tag: '39元200G', carrier: '联通' },
  { title: '中国联通飞霄卡', desc: '29元150G+200分钟，赠视频会员。', url: '/article/card/feixiao-card.html', tag: '29元150G', carrier: '联通' },
  { title: '中国联通飞继卡', desc: '29元280G+200分钟，首月全量全价。', url: '/article/card/feiji-card.html', tag: '29元280G', carrier: '联通' },
  { title: '中国联通飞芬卡', desc: '39元200G+200分钟，600元封顶。', url: '/article/card/feifen-card.html', tag: '39元200G', carrier: '联通' },
  { title: '中国联通飞素卡', desc: '39元240G+200分钟，首月全量全价。', url: '/article/card/feisu-card.html', tag: '39元240G', carrier: '联通' },
  { title: '中国联通飞希卡', desc: '29元180G+100分钟，首月半量半价。', url: '/article/card/feixi-card.html', tag: '29元180G', carrier: '联通' },
  { title: '中国联通飞焱卡', desc: '29元180G+100分钟，首月半量半价。', url: '/article/card/feiyan-card.html', tag: '29元180G', carrier: '联通' },
  { title: '中国联通活力卡', desc: '39元150G+200分钟，赠会员N选1。', url: '/article/card/huoli-card.html', tag: '39元150G', carrier: '联通' },
  { title: '中国联通极速卡', desc: '39元550G+300分钟，仅发四川。', url: '/article/card/jisu-card.html', tag: '39元550G', carrier: '联通' },
  { title: '中国联通康定卡', desc: '首月1元500G，四川专属。', url: '/article/card/kangding-card.html', tag: '500G', carrier: '联通' },
  { title: '中国联通南开卡', desc: '29元100G+200分钟，重庆专属。', url: '/article/card/nankai-card.html', tag: '29元100G', carrier: '联通' },
  { title: '中国联通上坎卡', desc: '39元190G+200分钟，重庆专属。', url: '/article/card/shangkan-card.html', tag: '39元190G', carrier: '联通' },
  { title: '中国联通洪崖卡', desc: '19元100G+200分钟，12个月优惠。', url: '/article/card/hongya-card.html', tag: '19元100G', carrier: '联通' },
  { title: '联通广绣卡', desc: '39元155G+100分钟，可发广东。', url: '/article/card/guangxiu-card.html', tag: '39元155G', carrier: '联通' },
  // 电信
  { title: '中国电信汉绣卡', desc: '39元130G+30G定向+200分钟，仅限湖北四城。', url: '/article/card/hanxiu-card.html', tag: '39元160G', carrier: '电信' },
  { title: '中国电信敬亭卡', desc: '39元150G+100分钟，48个月优惠期。', url: '/article/card/jingting-card.html', tag: '39元150G', carrier: '电信' },
  { title: '中国电信云朵卡', desc: '39元180G+200分钟，无合约期。', url: '/article/card/yunduo-card.html', tag: '39元180G', carrier: '电信' },
  { title: '中国电信泰山卡', desc: '38元190G+300分钟，无合约期。', url: '/article/card/taishan-card.html', tag: '38元190G', carrier: '电信' },
  { title: '中国电信云梦卡', desc: '39元160G+200分钟，仅发湖北七城。', url: '/article/card/yunmeng-card.html', tag: '39元160G', carrier: '电信' },
  { title: '中国电信知信卡', desc: '39元60G通用，只发广东。', url: '/article/card/zhixin-card.html', tag: '39元60G', carrier: '电信' },
  // 广电
  { title: '中国广电飞狮卡', desc: '29元192G通用，首月免费。', url: '/article/card/feishi-card.html', tag: '29元192G', carrier: '广电' },
  { title: '中国广电茯苓卡', desc: '29元200G通用，可办副卡。', url: '/article/card/fuling-card.html', tag: '29元200G', carrier: '广电' },
  { title: '中国广电欢马卡', desc: '29元192G通用，首月免费。', url: '/article/card/huanma-card.html', tag: '29元192G', carrier: '广电' },
  { title: '中国广电巨量卡', desc: '29元192G通用，长期套餐。', url: '/article/card/juliang-card.html', tag: '29元192G', carrier: '广电' },
  { title: '中国广电骏马卡', desc: '29元192G通用，首月免月租。', url: '/article/card/junma-card.html', tag: '29元192G', carrier: '广电' },
  { title: '中国广电天马卡', desc: '29元192G通用，可发全国。', url: '/article/card/tianma-card.html', tag: '29元192G', carrier: '广电' },
  { title: '中国广电奔马卡', desc: '39元60G通用，可办副卡。', url: '/article/card/benma-card.html', tag: '39元60G', carrier: '广电' },
  { title: '中国广电长安卡', desc: '29元100G+100分钟，仅限陕西。', url: '/article/card/changan-card.html', tag: '29元100G', carrier: '广电' },
  { title: '中国广电秦风卡', desc: '38元190G+300分钟，只发陕西四城。', url: '/article/card/qinfeng-card.html', tag: '38元190G', carrier: '广电' },
  { title: '中国广电闽南卡', desc: '39元180G+150分钟，仅发福建。', url: '/article/card/minnan-card.html', tag: '39元180G', carrier: '广电' }
]

// 筛选后的文章
const filteredArticles = computed(() => {
  const keyword = searchKeyword.value.toLowerCase()
  return articles.filter(item => {
    const matchTab = currentTab.value === 'all' || item.carrier === currentTab.value
    const matchSearch = !keyword ||
      item.title.toLowerCase().includes(keyword) ||
      item.desc.toLowerCase().includes(keyword)
    return matchTab && matchSearch
  })
})

// 总页数
const totalPages = computed(() => Math.ceil(filteredArticles.value.length / pageSize))

// 当前页文章
const pagedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredArticles.value.slice(start, start + pageSize)
})

// 分页显示
const displayPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})

// 切换 Tab
const switchTab = (tab) => {
  currentTab.value = tab
  currentPage.value = 1
}

// 跳转页面
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 搜索关键词变化时重置页码
watch(searchKeyword, () => {
  currentPage.value = 1
})

function copyWechat() {
  navigator.clipboard.writeText('wcbblll').then(() => {
    toast.show('微信号 wcbblll 已复制，打开微信搜索添加')
  }).catch(() => {
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
  background: #FFF3E6;
  color: #8A4B0A;
  font-size: 13px;
  line-height: 1.6;
  border: 1px solid #FFD9A8;
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

.recharge-icon { font-size: 28px; }

.recharge-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recharge-text strong { font-size: 15px; color: #92400e; }
.recharge-text span { font-size: 12px; color: #a16207; }

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
  background: var(--accent-light, #EBF5FF);
  border: 1px solid var(--accent, #004E89);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.cross-link-banner a {
  color: var(--accent, #004E89);
  font-weight: 600;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 8px;
  background: rgba(0, 78, 137, 0.08);
  transition: background .2s;
}
.cross-link-banner a:hover { background: rgba(0, 78, 137, 0.15); }
.cross-link-banner a:active { transform: scale(0.97); }

/* 选卡指南入口 */
.hero-entry-banner {
  max-width: 1100px;
  margin: 24px auto;
  padding: 14px 20px;
  background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
  border: 1px solid #FB923C;
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

.hero-entry-icon { font-size: 28px; }

.hero-entry-text strong { display: block; font-size: 15px; }
.hero-entry-text span { font-size: 12px; color: #9a3412; }

.hero-entry-link {
  color: #c2410c;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  padding: 6px 14px;
  border-radius: 8px;
  background: rgba(194, 65, 12, 0.08);
  transition: background .2s;
}
.hero-entry-link:hover { background: rgba(194, 65, 12, 0.15); }
.hero-entry-link:active { transform: scale(0.97); }

[data-theme="dark"] .hero-entry-banner {
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
  background: var(--primary-light, #FFF4ED);
  color: var(--primary, #FF6B35);
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.guide-content h3 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.guide-content p { font-size: 13px; color: var(--text-secondary, #6b7280); line-height: 1.6; margin: 0; }

.seo-note { font-size: 12px; color: var(--muted, #6b7280); margin-top: 10px; }

/* 暗色模式 */
[data-theme="dark"] .guide-card {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .recharge-banner {
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

.tab-nav::-webkit-scrollbar { display: none; }

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
  border-color: var(--primary, #FF6B35);
  color: var(--primary, #FF6B35);
}

.tab-btn.active {
  background: var(--primary, #FF6B35);
  color: #fff;
  border-color: var(--primary, #FF6B35);
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
  border-color: var(--primary, #FF6B35);
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
  color: var(--primary, #FF6B35);
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
  border-color: var(--primary, #FF6B35);
  color: var(--primary, #FF6B35);
}

.pagination button.active {
  background: var(--primary, #FF6B35);
  color: #fff;
  border-color: var(--primary, #FF6B35);
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
[data-theme="dark"] .article-card {
  background: rgba(31, 41, 55, 0.5);
  border-color: rgba(75, 85, 99, 0.5);
}

[data-theme="dark"] .article-card:hover {
  border-color: var(--primary, #FF6B35);
  box-shadow: 0 4px 12px rgba(129, 140, 248, 0.15);
}

[data-theme="dark"] .tag {
  background: rgba(99, 102, 241, 0.15);
}

[data-theme="dark"] .pagination button {
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

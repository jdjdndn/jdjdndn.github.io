<template>
  <main class="wifi-page">
      <PageHero
        icon='<path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>'
        title="随身WiFi专区"
        subtitle="便携WiFi · 多网可选 · 出行必备"
        aria="随身WiFi专区"
      />

      <!-- 信任徽章 -->
      <div class="trust-bar" role="list" aria-label="服务保障">
        <span class="trust-item" role="listitem">✓ 正规渠道</span>
        <span class="trust-item" role="listitem">✓ 全国包邮</span>
        <span class="trust-item" role="listitem">✓ 7天无理由</span>
      </div>

      <!-- 统计徽章条 -->
      <div class="stats-badge-bar">
        <div class="stats-badge-row">
          <span class="stats-badge-text"><strong>{{ wifiLinks.length }}</strong> 款设备</span>
          <span class="stats-badge-text"><strong>3</strong> 大运营商</span>
          <span class="stats-badge-text"><strong>7×24</strong> 在线服务</span>
        </div>
      </div>

      <!-- WiFi 产品列表 -->
      <div class="wifi-section">
        <div class="section-header">
          <span>WiFi设备</span>
          <span class="section-sub">共 {{ wifiLinks.length }} 款设备</span>
        </div>

        <div class="wifi-grid">
          <div v-for="device in wifiLinks" :key="device.name" class="product-card">
            <div class="card-head">
              <div class="device-header">
                <span class="device-icon" v-html="getProductIcon(device.name)"></span>
                <span class="device-name">{{ device.name }}</span>
              </div>
              <span v-if="device.badge" :class="['product-tag', device.badge === '热门' ? 'tag-error' : 'tag-success']">
                {{ device.badge }}
              </span>
            </div>
            <p class="device-desc">{{ device.description }}</p>
            <div class="card-meta">
              <span v-for="tag in (device.tags || [])" :key="tag" class="meta-tag info">{{ tag }}</span>
              <span v-if="getClickCount(device.name) > 0" class="meta-tag">已购买{{ formatCount(getClickCount(device.name)) }}次</span>
              <span v-if="isVisited(device.url)" class="meta-tag success">✓ 已访问</span>
            </div>
            <div class="device-price">价格：{{ device.priceRange }}</div>
            <div class="card-actions">
              <button class="btn btn-primary" @click="handleVisit(device)">
                <span v-html="ICONS.external"></span> 访问
              </button>
              <button class="btn" @click="handleQr(device)">
                <span v-html="ICONS.qr"></span> 二维码
              </button>
              <button class="btn" @click="handleShare(device)">分享</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 跨页面推荐 -->
      <div class="cross-link-banner">
        <span>需要一个手机号？号卡 <strong>19元/月起</strong></span>
        <router-link to="/haoka.html">去看看 →</router-link>
      </div>

      <!-- 对比表格（SEO/GEO） -->
      <div class="compare-section">
        <h3 class="section-title">随身WiFi对比</h3>
        <div class="compare-table-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th>产品</th>
                <th>网络</th>
                <th>流量</th>
                <th>价格</th>
                <th>特点</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="device in wifiLinks" :key="device.name">
                <td>{{ device.name }}</td>
                <td>{{ getNetworkType(device.name) }}</td>
                <td>{{ getDataAllowance(device.name) }}</td>
                <td>{{ device.priceRange }}</td>
                <td>{{ (device.tags || []).join('、') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 使用场景卡片 -->
      <div class="scenario-section">
        <h3 class="section-title">使用场景</h3>
        <div class="scenario-cards">
          <div v-for="scenario in scenarios" :key="scenario.id" class="scenario-card">
            <div class="scenario-icon">
              <span v-html="scenario.icon"></span>
            </div>
            <div class="scenario-content">
              <h3>{{ scenario.title }}</h3>
              <p>{{ scenario.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 常见问题 -->
      <div class="faq-section">
        <h3 class="section-title">常见问题</h3>
        <div class="faq-list">
          <details class="faq-item">
            <summary class="faq-question">随身WiFi是什么？</summary>
            <div class="faq-answer">随身WiFi是一种便携式无线网络设备，可以将有线网络转换为WiFi信号，方便在户外使用。</div>
          </details>
          <details class="faq-item">
            <summary class="faq-question">如何选择合适的套餐？</summary>
            <div class="faq-answer">根据您的使用需求选择：轻度使用选10GB/月，中度使用选50GB/月，重度使用选100GB/月以上。</div>
          </details>
          <details class="faq-item">
            <summary class="faq-question">信号覆盖范围？</summary>
            <div class="faq-answer">室内覆盖约10-20米，室外空旷地带可达50米以上，具体取决于设备型号和环境。</div>
          </details>
        </div>
      </div>

      <LegalLinks />
    <BackToTop />
    <QrModal
      :visible="showQr"
      :url="qrDevice?.url || ''"
      :title="qrDevice?.name || ''"
      @close="closeQrModal"
    />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from '../composables'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'
import BackToTop from '../components/BackToTop.vue'
import QrModal from '../components/QrModal.vue'
import { useClipboard, useShare } from '../composables'
import { wifiLinks } from '../templates/wifi-data.js'

const toast = useToast()
const { copy } = useClipboard()
const { quickShare } = useShare()

// 二维码模态框状态
const showQr = ref(false)
const qrDevice = ref(null)

// SVG 图标
const ICONS = {
  external: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  qr: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="4" height="4" rx="1"/><line x1="22" y1="14" x2="22" y2="14.01"/><line x1="18" y1="18" x2="18" y2="18.01"/><line x1="14" y1="22" x2="14" y2="22.01"/><line x1="18" y1="22" x2="18" y2="22.01"/><line x1="22" y1="18" x2="22" y2="18.01"/><line x1="22" y1="22" x2="22" y2="22.01"/></svg>',
  wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>',
  router: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="14" width="20" height="7" rx="2"/><circle cx="7" cy="17.5" r="1.5" fill="currentColor"/><circle cx="12" cy="17.5" r="1.5" fill="currentColor"/><path d="M12 3v8"/><path d="M8 7l4-4 4 4"/></svg>',
  battery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="10" x2="23" y2="14"/><rect x="4" y="9" width="5" height="6" rx="1" fill="currentColor" opacity="0.3"/><rect x="11" y="9" width="5" height="6" rx="1" fill="currentColor" opacity="0.3"/></svg>',
  signal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 20V4"/></svg>',
}

// 使用场景数据
const scenarios = ref([
  {
    id: 1,
    title: '出差旅行',
    desc: '便携小巧，随时随地保持网络连接，出差旅行必备',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 00-8 0v2"/></svg>'
  },
  {
    id: 2,
    title: '家庭备用',
    desc: '宽带故障时的应急上网方案，CPE设备支持多设备连接',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  {
    id: 3,
    title: '学生宿舍',
    desc: '免插卡CPE设备，宿舍多人共享，性价比高',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>'
  },
  {
    id: 4,
    title: '户外直播',
    desc: '稳定高速网络，支持户外直播和视频通话',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>'
  }
])

// 根据产品名判断图标
function getProductIcon(name) {
  if (name.includes('CPE') || name.includes('宽带')) return ICONS.router
  if (name.includes('充电宝')) return ICONS.battery
  if (name.includes('联通') || name.includes('单网')) return ICONS.signal
  return ICONS.wifi
}

// 获取网络类型
function getNetworkType(name) {
  if (name.includes('5G')) return '5G'
  if (name.includes('CPE') || name.includes('宽带')) return '4G/5G'
  return '4G'
}

// 获取流量
function getDataAllowance(name) {
  if (name.includes('CPE')) return '不限量'
  if (name.includes('充电宝')) return '3000G'
  return '按套餐'
}

// 格式化数字
function formatCount(n) {
  if (!n) return '0'
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}千`
  return String(n)
}

// 获取点击次数
function getClickCount(name) {
  try {
    const counts = JSON.parse(localStorage.getItem('wifiClicks') || '{}')
    return counts[name] || 0
  } catch {
    return 0
  }
}

// 记录点击
function trackClick(name) {
  try {
    const counts = JSON.parse(localStorage.getItem('wifiClicks') || '{}')
    counts[name] = (counts[name] || 0) + 1
    localStorage.setItem('wifiClicks', JSON.stringify(counts))
  } catch {}
}

// 检查是否已访问
function isVisited(url) {
  try {
    const list = JSON.parse(localStorage.getItem('wifiVisited') || '[]')
    return list.includes(url)
  } catch {
    return false
  }
}

// 标记已访问
function markVisited(url) {
  try {
    const list = JSON.parse(localStorage.getItem('wifiVisited') || '[]')
    if (!list.includes(url)) {
      list.push(url)
      localStorage.setItem('wifiVisited', JSON.stringify(list))
    }
  } catch {}
}

// 访问产品
function handleVisit(device) {
  trackClick(device.name)
  markVisited(device.url)
  window.open(device.url, '_blank', 'noopener')
}

// 显示二维码
function handleQr(device) {
  qrDevice.value = device
  showQr.value = true
}

// 关闭二维码模态框
function closeQrModal() {
  showQr.value = false
  qrDevice.value = null
}

// 复制链接
async function handleCopy(device) {
  await copy(device.url, `${device.name} 链接已复制`)
}

// 分享
async function handleShare(device) {
  await quickShare(device.name, device.url, device.description)
}
</script>

<style scoped>
/* 信任徽章 */
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

/* 统计徽章条 */
.stats-badge-bar {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: var(--radius, 12px);
  padding: 14px 16px;
  margin-bottom: 1rem;
}
.stats-badge-row {
  display: flex;
  justify-content: center;
  gap: 24px;
}
.stats-badge-text {
  font-size: 14px;
  color: var(--text-secondary, #4a5568);
}
.stats-badge-text strong {
  font-weight: 800;
  color: var(--text, #1a1a2e);
}

/* 区域标题 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.section-sub {
  font-size: 14px;
  color: var(--text-secondary, #4a5568);
}
.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text, #1a1a2e);
  margin-bottom: 16px;
}

/* WiFi 网格 */
.wifi-section { margin-bottom: 24px; }
.wifi-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 640px) {
  .wifi-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .wifi-grid { grid-template-columns: repeat(3, 1fr); }
}

/* 产品卡片 */
.product-card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: var(--radius, 12px);
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)),
              box-shadow 0.25s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));
}
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary, #FF6B35);
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}
.device-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.device-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text, #1a1a2e);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.product-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  flex-shrink: 0;
}
.tag-error { background: var(--danger-light, #FEF2F2); color: var(--danger, #DC2626); }
.tag-success { background: var(--success-light, #f0fdf4); color: var(--success, #16a34a); }
.info { background: var(--accent-light, #EBF5FF); color: var(--accent, #004E89); }

.device-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--accent-light, #EBF5FF);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent, #004E89);
  flex-shrink: 0;
}
.device-icon svg { width: 20px; height: 20px; }

.device-desc {
  color: var(--text-secondary, #4a5568);
  margin: 0 0 8px 0;
  font-size: 13px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}
.meta-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--hover-bg, #f5f4f1);
  color: var(--muted, #6b7280);
}
.meta-tag.info { background: var(--accent-light, #EBF5FF); color: var(--accent, #004E89); }
.meta-tag.success { background: var(--success-light, #f0fdf4); color: var(--success, #16a34a); }

.device-price {
  font-size: 12px;
  color: var(--text-secondary, #4a5568);
  margin-top: auto;
  padding-top: 8px;
}

/* 按钮组 */
.card-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
}
.btn {
  padding: 8px 0;
  border-radius: var(--radius-sm, 8px);
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  border: 1px solid var(--border, #e5e2dd);
  background: var(--card, #fff);
  color: var(--text, #1a1a2e);
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.btn svg { flex-shrink: 0; }
.btn:hover { background: var(--hover-bg, #f5f4f1); }
.btn-primary {
  background: var(--primary, #FF6B35);
  color: #fff;
  border-color: var(--primary, #FF6B35);
}
.btn-primary:hover { background: var(--primary-hover, #E55A2B); }

/* 对比表格 */
.compare-section { margin-top: 40px; padding: 0 4px; }
.compare-table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--border, #e5e2dd);
  border-radius: var(--radius, 12px);
  background: var(--card, #fff);
}
.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.compare-table thead { background: var(--hover-bg, #f5f4f1); }
.compare-table th {
  padding: 12px 14px;
  text-align: left;
  font-weight: 700;
  color: var(--text, #1a1a2e);
  white-space: nowrap;
  border-bottom: 2px solid var(--border, #e5e2dd);
}
.compare-table td {
  padding: 10px 14px;
  color: var(--muted, #6b7280);
  border-bottom: 1px solid var(--border, #e5e2dd);
  line-height: 1.5;
}
.compare-table tr:last-child td { border-bottom: none; }
.compare-table tbody tr:hover { background: var(--hover-bg, #f5f4f1); }

/* 使用场景 */
.scenario-section { margin-top: 40px; padding: 0 4px; }
.scenario-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.scenario-card {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: var(--radius, 12px);
}
.scenario-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--accent-light, #EBF5FF);
  flex-shrink: 0;
}
.scenario-icon svg { width: 20px; height: 20px; stroke: var(--accent, #004E89); }
.scenario-content h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text, #1a1a2e);
  margin-bottom: 4px;
}
.scenario-content p {
  font-size: 13px;
  color: var(--muted, #6b7280);
  line-height: 1.6;
  margin: 0;
}

/* FAQ */
.faq-section { margin-top: 40px; }

/* 响应式 */
@media (min-width: 640px) {
  .scenario-cards { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .compare-section, .scenario-section { margin-top: 32px; }
  .compare-table { font-size: 12px; }
  .compare-table th, .compare-table td { padding: 8px 10px; }
}

/* 暗色模式 */
[data-theme="dark"] .product-card:hover {
  border-color: var(--primary, #FF6B35);
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.15);
}
[data-theme="dark"] .scenario-card {
  background: rgba(31, 41, 55, 0.5);
  border-color: rgba(75, 85, 99, 0.5);
}
[data-theme="dark"] .compare-table-wrap {
  background: rgba(31, 41, 55, 0.5);
  border-color: rgba(75, 85, 99, 0.5);
}
[data-theme="dark"] .cross-link-banner {
  background: rgba(0, 78, 137, 0.15);
  border-color: rgba(0, 78, 137, 0.4);
}
[data-theme="dark"] .device-desc,
[data-theme="dark"] .scenario-content {
  color: var(--text-secondary, #a0a0b8);
}
[data-theme="dark"] .stats-badge-bar {
  background: rgba(31, 41, 55, 0.5);
  border-color: rgba(75, 85, 99, 0.5);
}
[data-theme="dark"] .product-card {
  background: rgba(31, 41, 55, 0.5);
  border-color: rgba(75, 85, 99, 0.5);
}
</style>
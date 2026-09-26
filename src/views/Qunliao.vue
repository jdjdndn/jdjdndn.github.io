<template>
  <main class="qunliao-page">
    <PageHero
      icon='<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>'
      title="群聊社区"
      subtitle="一起聊省钱 · 一起领福利"
      aria="群聊社区"
    />

    <!-- 搜索框 -->
    <div class="q-search-wrap">
      <div class="q-search-bar" role="search">
        <span class="q-search-icon" aria-hidden="true">🔍</span>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="搜索群聊名称 / 关键词..."
          aria-label="搜索群聊"
          autocomplete="off"
        />
        <button v-if="searchQuery" class="q-clear" aria-label="清除搜索" @click="searchQuery = ''">✕</button>
      </div>
    </div>
    <div v-if="searchQuery" class="q-count" aria-live="polite">
      {{ filteredGroups.length ? `找到 ${filteredGroups.length} 个群聊` : '未找到相关群聊' }}
    </div>

    <!-- 群卡片 -->
    <div class="group-grid">
      <div v-for="group in filteredGroups" :key="group.name" class="group-card" :class="{ disabled: group.disabled, 'has-qr': group.qr }">
        <div class="group-icon">{{ group.icon }}</div>
        <div class="group-info">
          <div class="group-name">{{ group.name }}</div>
          <div class="group-desc">{{ group.desc }}</div>
        </div>
        <span :class="['tag', group.disabled ? 'tag-default' : 'tag-success']">
          {{ group.tag }}
        </span>
        <div v-if="group.qr" class="group-qr">
          <img :src="group.qr" alt="网购优惠群微信二维码，扫码进群" />
          <p class="qr-tip">微信扫码加入 · 二维码7天内有效，失效后重新进入页面会更新</p>
        </div>
      </div>
    </div>

    <p class="f-note">💡 输入关键词筛选群聊 · 网购优惠群已开放扫码，其余群聊持续更新中</p>

    <!-- 群聊说明（充实内容，避免长屏底部空白） -->
    <div class="q-faq">
      <div class="faq-list">
        <details class="faq-item">
          <summary class="faq-question">群聊是免费加入的吗？</summary>
          <div class="faq-answer">是的，所有交流群均免费加入。入群后可以第一时间获取每日好价推送、优惠攻略答疑。</div>
        </details>
        <details class="faq-item">
          <summary class="faq-question">如何加入群聊？</summary>
          <div class="faq-answer">网购优惠群已开放：在页面上找到「网购优惠群」卡片，微信扫描卡片中的二维码即可入群。二维码7天内有效，过期后刷新页面会自动更新。其余群聊正在筹备中，开放后会同步在页面展示。</div>
        </details>
        <details class="faq-item">
          <summary class="faq-question">群聊里可以发广告吗？</summary>
          <div class="faq-answer">为维护群内体验，请勿在群内发布广告或刷屏。违规内容将被移出群聊，感谢理解。</div>
        </details>
      </div>
    </div>

    <LegalLinks />
    <BackToTop />
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'
import BackToTop from '../components/BackToTop.vue'

const searchQuery = ref('')

const groups = [
  {
    name: '网购好价',
    desc: '每日好价推送 · 购物优惠分享',
    icon: '🛒',
    tag: '扫码加入',
    qr: './qunliao-qr.jpg'
  },
  {
    name: '项目交流群',
    desc: '号卡业务 · 现状交流 · 筹备中',
    icon: '📈',
    tag: '筹备中',
    disabled: true
  },
  {
    name: '好物分享群',
    desc: '每日好物推荐 · 亲测优惠 · 筹备中',
    icon: '📦',
    tag: '筹备中',
    disabled: true
  },
  {
    name: '会员福利交流群',
    desc: '影视/音乐会员优惠分享 · 筹备中',
    icon: '👑',
    tag: '筹备中',
    disabled: true
  }
]

const filteredGroups = computed(() => {
  if (!searchQuery.value) return groups
  const q = searchQuery.value.toLowerCase()
  return groups.filter(g =>
    g.name.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q)
  )
})
</script>

<style scoped>
.qunliao-page{
  width: 100%;
}
.q-search-wrap {
  max-width: 800px;
  margin: 0 auto 16px;
  padding: 0 16px;
}

.q-search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
  transition: border-color 0.2s;
}

.q-search-bar:focus-within {
  border-color: var(--primary, #FF6B35);
}

.q-search-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.q-search-bar input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: var(--text, #1a1a2e);
}

.q-search-bar input::placeholder {
  color: var(--placeholder, #b0aaa0);
}

.q-clear {
  background: none;
  border: none;
  font-size: 14px;
  color: var(--muted, #6b7280);
  cursor: pointer;
  padding: 4px;
}

.q-count {
  max-width: 800px;
  margin: 0 auto 16px;
  padding: 0 16px;
  font-size: 13px;
  color: var(--muted, #6b7280);
}

.group-grid {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.group-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
  transition: all 0.2s;
}

.group-card.has-qr {
  flex-direction: column;
  align-items: stretch;
  grid-column: 1 / -1;
}

.group-card.has-qr .group-icon {
  font-size: 32px;
}

.group-card.has-qr .group-info {
  text-align: left;
}

.group-card.has-qr .tag {
  align-self: flex-start;
}

.group-qr {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: #fafaf8;
  border: 1px dashed var(--border, #e5e2dd);
  border-radius: 12px;
  padding: 16px;
}

.group-qr img {
  width: 200px;
  height: 200px;
  max-width: 100%;
  border-radius: 8px;
  background: #fff;
}

.qr-tip {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  text-align: center;
  line-height: 1.5;
}

[data-theme="dark"] .group-qr {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}

.group-card:not(.disabled):hover {
  border-color: var(--primary, #FF6B35);
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.1);
}

.group-card.disabled {
  opacity: 0.6;
}

.group-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.group-info {
  flex: 1;
  min-width: 0;
}

.group-name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
}

.group-desc {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.f-note {
  max-width: 800px;
  margin: 24px auto 48px;
  padding: 0 16px;
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

/* 群聊说明区 */
.q-faq {
  max-width: 800px;
  margin: 0 auto 24px;
  padding: 0 16px;
}
.tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.tag-success {
  background: var(--success-bg, #e6f9ee);
  color: var(--success, #16a34a);
}

.tag-info {
  background: var(--info-bg, #e8f0fe);
  color: var(--info, #2563eb);
}

.tag-default {
  background: var(--muted-bg, #f3f4f6);
  color: var(--muted, #6b7280);
}

.q-faq .faq-list {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
  padding: 4px 0;
}

.q-faq .faq-item {
  border-bottom: 1px solid var(--border-light, #f0eeeb);
  transition: background-color 0.15s ease;
}

.q-faq .faq-item:last-child {
  border-bottom: none;
}

.q-faq .faq-question {
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 14px 16px;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text, #1a1a2e);
  transition: color 0.15s ease, background-color 0.15s ease;
  border-radius: 8px;
  margin: 2px 8px;
}

.q-faq .faq-question:hover {
  color: var(--primary, #FF6B35);
  background: var(--hover-bg, #f5f4f1);
}

.q-faq .faq-question::-webkit-details-marker {
  display: none;
}

.q-faq .faq-question::after {
  content: '▸';
  font-size: 12px;
  color: var(--muted, #6b7280);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.q-faq .faq-item[open] .faq-question::after {
  transform: rotate(90deg);
}

.q-faq .faq-answer {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  padding: 0 16px 14px;
  line-height: 1.7;
}

[data-theme="dark"] .q-search-bar,
[data-theme="dark"] .group-card {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .tag-success {
  background: var(--success-bg, #0d3320);
  color: var(--success, #4ade80);
}

[data-theme="dark"] .tag-info {
  background: var(--info-bg, #0d1f3c);
  color: var(--info, #60a5fa);
}

[data-theme="dark"] .tag-default {
  background: var(--muted-bg, #2d2d45);
  color: var(--muted, #a0aec0);
}

[data-theme="dark"] .q-faq .faq-list {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .q-faq .faq-item {
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .q-faq .faq-question:hover {
  background: rgba(255, 107, 53, 0.08);
}

[data-theme="dark"] .q-faq .faq-question::after {
  color: var(--muted, #707088);
}

[data-theme="dark"] .f-note {
  color: var(--text-secondary, #a0aec0);
}
</style>

<template>
  <main class="fuye-page">
    <PageHero
      icon='<path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>'
      title="副业专区"
      subtitle="副业机会梳理 · 电商带货 / 会员分销 / App拉新 / 号卡现状"
      aria="副业专区"
    >
      <template #badge>
        <span class="stat-badge"><strong>4+</strong> 副业方向</span>
        <span class="stat-badge"><strong>10+</strong> 篇攻略</span>
        <span class="stat-badge"><strong>0</strong> 元成本起步</span>
      </template>
    </PageHero>

    <!-- 副业分类入口 -->
    <div class="entry-grid">
      <div v-for="(entry, idx) in entries" :key="entry.name" :class="['entry-grid-item', idx === entries.length - 1 ? 'full-width' : '']">
        <router-link :to="entry.url" class="entry-card">
          <div class="entry-icon">{{ entry.icon }}</div>
          <div class="entry-info">
            <div class="entry-name">{{ entry.name }}</div>
            <div class="entry-desc">{{ entry.desc }}</div>
          </div>
          <span :class="['tag', 'tag-' + (entry.tagType || 'default')]">{{ entry.tag }}</span>
        </router-link>
      </div>
    </div>

    <p class="f-note">💡 选择副业方向，查看对应攻略 · 按需投入，量力而行</p>

    <LegalLinks />
    <BackToTop />
  </main>
</template>

<script setup>
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'
import BackToTop from '../components/BackToTop.vue'

const entries = [
  {
    name: '号卡业务',
    desc: '号卡新规后现状 · 合规与防骗',
    icon: '📱',
    url: '/fuye/haoka.html',
    tag: '5 篇指南',
    tagType: 'success'
  },
  {
    name: '会员分销',
    desc: '影视 / 音乐会员推广赚佣金',
    icon: '👑',
    url: '/fuye/huiyuan.html',
    tag: '分销',
    tagType: 'warning'
  },
  {
    name: '上门回收',
    desc: '回收旧衣服、旧手机、家电',
    icon: '♻️',
    url: '/fuye/huishou.html',
    tag: '攻略',
    tagType: 'info'
  },
  {
    name: 'App拉新',
    desc: '帮APP推广拉新用户赚佣金',
    icon: '📢',
    url: '/fuye/laxin.html',
    tag: '攻略',
    tagType: 'info'
  },
  {
    name: '电商带货',
    desc: '京东 / 淘宝 / 拼多多 / 携程 / 同程优惠推广',
    icon: '🛒',
    url: '/fuye/dianshang.html',
    tag: '入口',
    tagType: 'error'
  },
  {
    name: '随身WiFi代理',
    desc: '便携WiFi设备代理 · 收益以实际为准',
    icon: '📶',
    url: '/fuye/wifi-agent.html',
    tag: '代理',
    tagType: 'info'
  },
  {
    name: '更多副业',
    desc: '更多副业方向持续更新中',
    icon: '💡',
    url: '/article/index.html',
    tag: '更新中',
    tagType: 'default'
  }
]
</script>

<style scoped>
.entry-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}
@media (min-width: 640px) {
  .entry-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .entry-grid { grid-template-columns: repeat(3, 1fr); }
}

/* 最后一项（更多副业）整行通栏展示 */
.entry-grid-item.full-width {
  grid-column: 1 / -1;
}
.entry-grid-item.full-width .entry-card {
  border-style: dashed;
  background: var(--card, #fff);
  justify-content: center;
  text-align: center;
}

.entry-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text, #1a1a2e);
  transition: all 0.2s ease;
}

.entry-card:hover {
  border-color: var(--primary, #FF6B35);
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.1);
  transform: translateY(-1px);
}

.entry-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--primary-light, #FFF4ED);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.entry-info {
  flex: 1;
  min-width: 0;
}

.entry-name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
}

.entry-desc {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.f-note {
  max-width: 800px;
  margin: 24px auto 48px;
  padding: 0 16px;
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

/* 暗色模式 */
[data-theme="dark"] .entry-card {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}
</style>

<template>
  <main class="huiyuan-page">
    <PageHero
      icon='<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>'
      title="会员优惠"
      subtitle="影视会员 · 音乐会员 · 流量站 — 优惠价格享受高品质服务"
      aria="会员优惠"
    >
      <template #badge>
        <span class="stat-badge">
          已收录 <strong>3</strong> 个平台
        </span>
      </template>
    </PageHero>

    <!-- 信任徽章 -->
    <div class="trust-bar" role="list" aria-label="服务保障">
      <span class="trust-item" role="listitem">✓ 正规渠道</span>
      <span class="trust-item" role="listitem">✓ 安全可靠</span>
    </div>

    <!-- 会员卡片 -->
    <div class="member-grid">
      <a
        v-for="member in members"
        :key="member.name"
        :href="member.url"
        target="_blank"
        rel="noopener"
        class="member-card"
      >
        <div class="member-icon" v-html="member.icon"></div>
        <div class="member-info">
          <div class="member-name">{{ member.name }}</div>
          <div class="member-desc">{{ member.desc }}</div>
        </div>
        <div class="member-tags">
          <span class="member-tag">✓ 正规渠道</span>
          <span class="member-tag">✓ 优惠价格</span>
        </div>
      </a>
    </div>

    <LegalLinks />
  </main>
</template>

<script setup>
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'

const members = [
  {
    name: '影视会员',
    desc: '各大平台影视VIP会员优惠办理',
    url: 'https://wcbblll.99kami.com',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>'
  },
  {
    name: '音乐会员',
    desc: 'QQ音乐/网易云等音乐VIP优惠',
    url: 'https://wcbblll.im01.cn',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>'
  },
  {
    name: '福来流量站',
    desc: '粉丝关注服务',
    url: 'http://35568.qcxmt.cn',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>'
  }
]
</script>

<style scoped>
.trust-bar {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
  padding: 12px 16px;
}

.trust-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--success, #16a34a);
}

.member-grid {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.member-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 24px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 16px;
  text-decoration: none;
  color: var(--text, #1a1a2e);
  transition: all 0.3s ease;
  text-align: center;
}

.member-card:hover {
  border-color: var(--primary, #FF6B35);
  box-shadow: 0 8px 32px rgba(255, 107, 53, 0.12);
  transform: translateY(-2px);
}

.member-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary-light, #FFF4ED), var(--primary, #FF6B35));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.member-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.member-desc {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.member-tags {
  display: flex;
  gap: 8px;
}

.member-tag {
  font-size: 12px;
  color: var(--success, #16a34a);
  padding: 4px 8px;
  background: var(--success-light, #f0fdf4);
  border-radius: 6px;
}

[data-theme="dark"] .member-card {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}
</style>

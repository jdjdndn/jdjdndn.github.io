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
      <div v-for="group in filteredGroups" :key="group.name" class="group-card" :class="{ disabled: group.disabled }">
        <div class="group-icon">{{ group.icon }}</div>
        <div class="group-info">
          <div class="group-name">{{ group.name }}</div>
          <div class="group-desc">{{ group.desc }}</div>
        </div>
        <n-tag size="small" :type="group.disabled ? 'default' : 'success'">
          {{ group.tag }}
        </n-tag>
      </div>
    </div>

    <p class="f-note">💡 输入关键词筛选群聊 · 群聊入口持续更新，敬请期待</p>

    <!-- 群聊说明（充实内容，避免长屏底部空白） -->
    <div class="q-faq">
      <n-collapse :bordered="false">
        <n-collapse-item title="群聊是免费加入的吗？" name="1">
          是的，所有交流群均免费加入。入群后可以第一时间获取每日好价推送、优惠攻略答疑。
        </n-collapse-item>
        <n-collapse-item title="如何加入群聊？" name="2">
          群聊正式开放后，点击对应群聊卡片即可扫码入群。目前各群正在筹备中，请耐心等待。
        </n-collapse-item>
        <n-collapse-item title="群聊里可以发广告吗？" name="3">
          为维护群内体验，请勿在群内发布广告或刷屏。违规内容将被移出群聊，感谢理解。
        </n-collapse-item>
      </n-collapse>
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
    name: '官方交流群',
    desc: '每日好价推送 · 攻略答疑 · 筹备中',
    icon: '💬',
    tag: '筹备中',
    disabled: true
  },
  {
    name: '副业交流群',
    desc: '号卡代理 · 推广经验交流 · 筹备中',
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
.q-faq :deep(.n-collapse) {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
  padding: 4px 16px;
}
.q-faq :deep(.n-collapse-item__header-main) {
  font-size: 14px;
  font-weight: 600;
}
.q-faq :deep(.n-collapse-item__content-inner) {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

[data-theme="dark"] .q-search-bar,
[data-theme="dark"] .group-card {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .q-faq :deep(.n-collapse) {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .f-note {
  color: var(--text-secondary, #a0aec0);
}
</style>

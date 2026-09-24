<template>
  <div
    class="activity-card"
    :class="[
      `card-${type}-style`,
      { expired, 'expiring-soon': expiringSoon }
    ]"
    role="article"
    :aria-label="item.name"
    :style="cardStyle"
  >
    <div class="card-gradient-bar"></div>
    <div class="card-head">
      <span class="card-icon-badge">{{ icon }}</span>
      <span class="card-name" v-html="displayName"></span>
      <div class="card-badges">
        <span v-if="isMiniApp" class="miniapp-tag">小程序</span>
        <span v-if="expired" class="card-badge badge-expired">⏳ 已过期</span>
        <template v-else>
          <span v-if="isNew" class="card-badge badge-new">🆕 新</span>
          <span v-if="isHot" class="card-badge badge-hot">🔥 热门</span>
          <span v-if="expiringSoon" class="card-badge badge-expiring">⏰ 即将过期</span>
        </template>
      </div>
    </div>
    <div v-if="item.description" class="card-desc">{{ item.description }}</div>
    <div v-if="deadlineDisplay" class="card-deadline-wrapper" :class="{ 'data-expiring': expiringSoon }">
      {{ deadlineDisplay }}
    </div>
    <div v-if="type === 'code'" class="card-code" v-html="displayCode"></div>
    <a v-if="type === 'link'" class="card-link" :href="item.link" target="_blank" rel="noopener" :title="item.link" @click="handleLinkClick($event)">
      {{ host || '前往活动' }}
    </a>
    <div class="card-actions">
      <button v-if="type === 'code'" class="btn-copy" :disabled="expired" @click="handleCopy">
        复制口令
      </button>
      <a v-if="type === 'link'" class="btn-go" :href="item.link" target="_blank" rel="noopener" :class="{ 'tabindex-disabled': expired }" @click="handleLinkClick($event)">
        前往活动
      </a>
      <button class="btn-qr" @click="handleQr">二维码</button>
      <button class="btn-share" @click="handleShare">分享</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useClipboard, useShare } from '../composables'
import { isExpired, isExpiringSoon, isNewActivity, isHotActivity, formatCountdown, highlightText, getIconForName } from '../composables/useUtils'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    default: 'code',
    validator: (v) => ['code', 'link'].includes(v)
  },
  query: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['copy', 'qr', 'share'])

const { copy } = useClipboard()
const { quickShare } = useShare()

const expired = computed(() => isExpired(props.item.deadline))
const expiringSoon = computed(() => isExpiringSoon(props.item.deadline))
const isNew = computed(() => isNewActivity(props.item))
const isHot = computed(() => isHotActivity(props.item))
const isMiniApp = computed(() => props.item.code && (props.item.code.startsWith('mp://') || props.item.code.startsWith('weixin://')))

const isWeixinEnv = () => /MicroMessenger/i.test(navigator.userAgent)

const handleLinkClick = (e) => {
  if (props.item.link?.startsWith('weixin://') && !isWeixinEnv()) {
    e.preventDefault()
    alert('请在微信中打开此链接')
  }
}

const icon = computed(() => getIconForName(props.item.name))

const displayName = computed(() => {
  return props.query ? highlightText(props.item.name, props.query) : props.item.name
})

const displayCode = computed(() => {
  return props.query ? highlightText(props.item.code, props.query) : props.item.code
})

const host = computed(() => {
  try {
    return new URL(props.item.link).hostname.replace('www.', '')
  } catch {
    return props.item.link
  }
})

const deadlineDisplay = computed(() => {
  if (!props.item.deadline) return ''
  return expiringSoon.value ? formatCountdown(props.item.deadline) : `截止 ${props.item.deadline}`
})

const cardStyle = computed(() => ({
  '--card-gradient': 'linear-gradient(135deg, #FFF4ED 0%, #FFE8DB 100%)',
  '--card-accent': '#FF6B35'
}))

const handleCopy = async () => {
  await copy(props.item.code, '口令已复制')
  emit('copy', props.item)
}

const handleQr = () => {
  emit('qr', props.item)
}

const handleShare = async () => {
  await quickShare(props.item.name, props.item.link || '', props.item.code || '')
  emit('share', props.item)
}
</script>

<style scoped>
.activity-card {
  display: flex;
  flex-direction: column;
  background: var(--card-gradient, linear-gradient(135deg, #f8f9fa, #e9ecef));
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--border, #e5e7eb);
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
  height: 100%;
}

.activity-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.activity-card.expired {
  opacity: 0.7;
}

.activity-card.expiring-soon {
  border-color: var(--warning, #f59e0b);
}

.card-gradient-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-accent, #FF6B35);
}

.card-head {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.card-icon-badge {
  font-size: 20px;
  line-height: 1;
}

.card-name {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--text, #1f2937);
  line-height: 1.4;
}

.card-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex-shrink: 0;
}

.card-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.05);
  white-space: nowrap;
}

.badge-expired {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.badge-new {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.badge-hot {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.badge-expiring {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.miniapp-tag {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(7, 193, 96, 0.1);
  color: #07c160;
}

.card-desc {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  margin-bottom: 8px;
  line-height: 1.5;
  flex: 1;
}

.card-deadline-wrapper {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  margin-bottom: 12px;
}

.card-deadline-wrapper.data-expiring {
  color: var(--warning, #d97706);
  font-weight: 500;
}

.card-code {
  background: rgba(0, 0, 0, 0.03);
  border: 1px dashed var(--border, #e5e7eb);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--text, #1f2937);
  word-break: break-all;
  margin-bottom: 12px;
  font-family: monospace;
}

.card-link {
  display: block;
  font-size: 13px;
  color: var(--primary, #FF6B35);
  text-decoration: none;
  margin-bottom: 12px;
  word-break: break-all;
}

.card-link:hover {
  text-decoration: underline;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--border-light, #f0eeeb);
}

.card-actions button,
.card-actions a {
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-copy {
  background: var(--primary, #FF6B35);
  color: white;
  border: none;
}

.btn-copy:hover:not(:disabled) {
  background: var(--primary-hover, #e55a2b);
}

.btn-copy:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-go {
  background: var(--primary, #FF6B35);
  color: white;
  border: none;
}

.btn-go:hover {
  background: var(--primary-hover, #e55a2b);
}

.btn-go.tabindex-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.btn-qr,
.btn-share {
  background: var(--card, #fff);
  color: var(--text, #1f2937);
  border: 1px solid var(--border, #e5e7eb);
}

.btn-qr:hover,
.btn-share:hover {
  background: var(--hover-bg, #f3f4f6);
  border-color: var(--primary, #FF6B35);
  color: var(--primary, #FF6B35);
}

/* 暗色模式 */
[data-theme="dark"] .activity-card {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(55, 65, 81, 0.6));
  border-color: rgba(75, 85, 99, 0.5);
}

[data-theme="dark"] .card-code {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(75, 85, 99, 0.5);
}

[data-theme="dark"] .card-badge {
  background: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .card-actions {
  border-top-color: rgba(75, 85, 99, 0.5);
}

[data-theme="dark"] .btn-qr,
[data-theme="dark"] .btn-share {
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(75, 85, 99, 0.5);
}
</style>

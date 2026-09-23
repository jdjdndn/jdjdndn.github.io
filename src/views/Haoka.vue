<template>
  <div class="app-wrapper">
    <SiteNav position="side" />
    <div id="app">
      <PageHero
        icon='<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>'
        title="号卡办理专区"
        subtitle="流量卡 · 四网可选 · 正规运营商授权"
        aria="号卡办理专区"
      />

      <n-card title="号卡办理" :bordered="false">
        <template #header-extra>
          <n-tag type="success">热门</n-tag>
        </template>

        <n-grid :cols="3" :x-gap="12" :y-gap="12" responsive="screen" item-responsive>
          <n-gi v-for="card in cards" :key="card.id" span="3 m:1">
            <n-card hoverable>
              <template #header>
                <div class="card-header">
                  <span class="card-icon">{{ card.icon }}</span>
                  <span>{{ card.name }}</span>
                </div>
              </template>
              <p class="card-desc">{{ card.desc }}</p>
              <template #action>
                <n-button type="primary" block @click="handleClick(card)">
                  立即办理
                </n-button>
              </template>
            </n-card>
          </n-gi>
        </n-grid>
      </n-card>

      <LegalLinks />
    </div>
    <SiteNav position="footer" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import SiteNav from '../components/SiteNav.vue'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'

const message = useMessage()

const cards = ref([
  { id: 1, icon: '📱', name: '移动号卡', desc: '大流量套餐，低月租', url: '#' },
  { id: 2, icon: '📶', name: '联通号卡', desc: '四网通用，信号稳定', url: '#' },
  { id: 3, icon: '📞', name: '电信号卡', desc: '5G套餐，超大流量', url: '#' },
  { id: 4, icon: '🌐', name: '广电号卡', desc: '新运营商，优惠多多', url: '#' }
])

function handleClick(card) {
  message.info(`正在跳转到 ${card.name}...`)
}
</script>

<style scoped>
.app-wrapper {
  display: flex;
  min-height: 100vh;
}

#app {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-icon {
  font-size: 1.5rem;
}

.card-desc {
  color: var(--text-secondary, #666);
  margin: 0;
}
</style>

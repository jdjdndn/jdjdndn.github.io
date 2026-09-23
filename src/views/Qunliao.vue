<template>
  <div class="app-wrapper">
    <SiteNav position="side" />
    <div id="app">
      <PageHero
        icon='<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>'
        title="群聊优惠"
        subtitle="社群优惠分享"
        aria="群聊优惠"
      />

      <n-card :bordered="false">
        <template #header>
          <div class="section-header">
            <span>优惠群聊</span>
            <n-text depth="3" style="font-size: 14px">
              共 {{ groups.length }} 个群聊
            </n-text>
          </div>
        </template>

        <n-grid :cols="3" :x-gap="12" :y-gap="12" responsive="screen" item-responsive>
          <n-gi v-for="group in groups" :key="group.id" span="3 m:1">
            <n-card hoverable>
              <template #header>
                <div class="group-header">
                  <span class="group-icon">{{ group.icon }}</span>
                  <span>{{ group.name }}</span>
                </div>
              </template>
              <template #header-extra>
                <n-tag :type="group.tagType" size="small">
                  {{ group.tag }}
                </n-tag>
              </template>
              <p class="group-desc">{{ group.desc }}</p>
              <n-space vertical :size="4">
                <n-text depth="3" style="font-size: 12px">
                  成员数：{{ group.members }}
                </n-text>
                <n-text depth="3" style="font-size: 12px">
                  更新频率：{{ group.frequency }}
                </n-text>
              </n-space>
              <template #action>
                <n-button type="primary" block @click="handleJoin(group)">
                  加入群聊
                </n-button>
              </template>
            </n-card>
          </n-gi>
        </n-grid>
      </n-card>

      <n-card title="如何加入群聊？" :bordered="false">
        <n-steps :current="1" vertical>
          <n-step title="选择群聊" description="根据您的兴趣选择合适的优惠群聊" />
          <n-step title="扫码加入" description="扫描群聊二维码或点击链接加入" />
          <n-step title="获取优惠" description="在群内获取最新优惠信息和口令码" />
        </n-steps>
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

const groups = ref([
  { id: 1, icon: '🍔', name: '外卖优惠群', desc: '美团/饿了么红包分享', members: 500, frequency: '每日更新', tag: '热门', tagType: 'error' },
  { id: 2, icon: '🛒', name: '电商优惠群', desc: '淘宝/京东/拼多多优惠', members: 800, frequency: '实时更新', tag: '活跃', tagType: 'success' },
  { id: 3, icon: '🚗', name: '出行优惠群', desc: '滴滴/高德打车券分享', members: 300, frequency: '每周更新', tag: '出行', tagType: 'info' },
  { id: 4, icon: '☕', name: '咖啡茶饮群', desc: '瑞幸/星巴克优惠分享', members: 450, frequency: '每日更新', tag: '饮品', tagType: 'warning' },
  { id: 5, icon: '🎬', name: '娱乐优惠群', desc: '电影/游戏/会员优惠', members: 350, frequency: '每周更新', tag: '娱乐', tagType: 'info' },
  { id: 6, icon: '📦', name: '快递优惠群', desc: '快递寄件折扣分享', members: 280, frequency: '每周更新', tag: '寄件', tagType: 'success' }
])

function handleJoin(group) {
  message.success(`正在跳转到 ${group.name} 加入页面...`)
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.group-icon {
  font-size: 1.5rem;
}

.group-desc {
  color: var(--text-secondary, #666);
  margin: 0 0 0.5rem 0;
}
</style>

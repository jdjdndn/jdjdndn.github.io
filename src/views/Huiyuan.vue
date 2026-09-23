<template>
  <div class="app-wrapper">
    <SiteNav position="side" />
    <div id="app">
      <PageHero
        icon='<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'
        title="会员优惠专区"
        subtitle="VIP会员优惠"
        aria="会员优惠专区"
      />

      <n-card :bordered="false">
        <template #header>
          <div class="section-header">
            <span>会员平台</span>
            <n-text depth="3" style="font-size: 14px">
              共 {{ memberPlatforms.length }} 个平台
            </n-text>
          </div>
        </template>

        <n-grid :cols="3" :x-gap="12" :y-gap="12" responsive="screen" item-responsive>
          <n-gi v-for="platform in memberPlatforms" :key="platform.id" span="3 m:1">
            <n-card hoverable>
              <template #header>
                <div class="platform-header">
                  <span class="platform-icon">{{ platform.icon }}</span>
                  <span>{{ platform.name }}</span>
                </div>
              </template>
              <template #header-extra>
                <n-tag :type="platform.tagType" size="small">
                  {{ platform.tag }}
                </n-tag>
              </template>
              <p class="platform-desc">{{ platform.desc }}</p>
              <n-space vertical :size="4">
                <n-text depth="3" style="font-size: 12px">
                  优惠力度：{{ platform.discount }}
                </n-text>
                <n-text depth="3" style="font-size: 12px">
                  有效期：{{ platform.validity }}
                </n-text>
              </n-space>
              <template #action>
                <n-button type="primary" block @click="handleGet(platform)">
                  立即领取
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

const memberPlatforms = ref([
  { id: 1, icon: '🥭', name: '芒果TV会员', desc: '芒果TV会员优惠', discount: '7折', validity: '30天', tag: '热门', tagType: 'error' },
  { id: 2, icon: '📺', name: '爱奇艺会员', desc: '爱奇艺黄金会员', discount: '6折', validity: '30天', tag: '超值', tagType: 'warning' },
  { id: 3, icon: '🎵', name: '网易云音乐', desc: '网易云音乐黑胶会员', discount: '5折', validity: '30天', tag: '特惠', tagType: 'success' },
  { id: 4, icon: '📚', name: '百度文库', desc: '百度文库VIP会员', discount: '6.5折', validity: '30天', tag: '限时', tagType: 'info' },
  { id: 5, icon: '🎮', name: '腾讯视频', desc: '腾讯视频VIP会员', discount: '7.5折', validity: '30天', tag: '热门', tagType: 'error' },
  { id: 6, icon: '📖', name: '知乎盐选', desc: '知乎盐选会员', discount: '6折', validity: '30天', tag: '新上', tagType: 'warning' }
])

function handleGet(platform) {
  message.success(`正在跳转到 ${platform.name} 领取页面...`)
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

.platform-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.platform-icon {
  font-size: 1.5rem;
}

.platform-desc {
  color: var(--text-secondary, #666);
  margin: 0 0 0.5rem 0;
}
</style>

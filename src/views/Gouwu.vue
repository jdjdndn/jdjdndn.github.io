<template>
  <div class="app-wrapper">
    <SiteNav position="side" />
    <div id="app">
      <PageHero
        icon='<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>'
        title="购物优惠"
        subtitle="电商平台优惠"
        aria="购物优惠"
      />

      <n-card :bordered="false">
        <template #header>
          <div class="section-header">
            <span>电商平台</span>
            <n-space>
              <n-input
                v-model:value="searchQuery"
                placeholder="搜索平台..."
                clearable
                size="small"
              >
                <template #prefix>
                  <span>🔍</span>
                </template>
              </n-input>
            </n-space>
          </div>
        </template>

        <n-grid :cols="3" :x-gap="12" :y-gap="12" responsive="screen" item-responsive>
          <n-gi v-for="platform in filteredPlatforms" :key="platform.id" span="3 m:1">
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
                  优惠类型：{{ platform.type }}
                </n-text>
                <n-text depth="3" style="font-size: 12px">
                  优惠力度：{{ platform.discount }}
                </n-text>
              </n-space>
              <template #action>
                <n-button type="primary" block @click="handleShop(platform)">
                  立即购物
                </n-button>
              </template>
            </n-card>
          </n-gi>
        </n-grid>

        <n-empty v-if="filteredPlatforms.length === 0" description="暂无平台" />
      </n-card>

      <LegalLinks />
    </div>
    <SiteNav position="footer" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMessage } from 'naive-ui'
import SiteNav from '../components/SiteNav.vue'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'

const message = useMessage()
const searchQuery = ref('')

const platforms = ref([
  { id: 1, icon: '🛒', name: '淘宝', desc: '中国最大的电商平台', type: '优惠券', discount: '满减', tag: '热门', tagType: 'error' },
  { id: 2, icon: '🏪', name: '京东', desc: '正品保障，快速配送', type: '秒杀', discount: '直降', tag: '品质', tagType: 'success' },
  { id: 3, icon: '🛍️', name: '拼多多', desc: '拼团购物，更便宜', type: '拼团', discount: '团购价', tag: '便宜', tagType: 'warning' },
  { id: 4, icon: '📦', name: '天猫', desc: '品牌正品，品质保障', type: '满减', discount: '跨店满减', tag: '品牌', tagType: 'info' },
  { id: 5, icon: '🎮', name: '抖音电商', desc: '直播购物，限时优惠', type: '直播', discount: '直播间价', tag: '直播', tagType: 'error' },
  { id: 6, icon: '📱', name: '快手电商', desc: '老铁推荐，真实优惠', type: '达人', discount: '达人价', tag: '真实', tagType: 'success' }
])

const filteredPlatforms = computed(() => {
  return platforms.value.filter(platform => {
    return !searchQuery.value ||
      platform.name.includes(searchQuery.value) ||
      platform.desc.includes(searchQuery.value)
  })
})

function handleShop(platform) {
  message.success(`正在跳转到 ${platform.name}...`)
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

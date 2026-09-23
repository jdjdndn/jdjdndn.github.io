<template>
  <div class="app-wrapper">
    <SiteNav position="side" />
    <div id="app">
      <PageHero
        icon='<path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/>'
        title="网盘资源"
        subtitle="免费网盘推荐"
        aria="网盘资源"
      />

      <n-card :bordered="false">
        <template #header>
          <div class="section-header">
            <span>网盘平台</span>
            <n-space>
              <n-input
                v-model:value="searchQuery"
                placeholder="搜索网盘..."
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
          <n-gi v-for="disk in filteredDisks" :key="disk.id" span="3 m:1">
            <n-card hoverable>
              <template #header>
                <div class="disk-header">
                  <span class="disk-icon">{{ disk.icon }}</span>
                  <span>{{ disk.name }}</span>
                </div>
              </template>
              <template #header-extra>
                <n-tag :type="disk.tagType" size="small">
                  {{ disk.tag }}
                </n-tag>
              </template>
              <p class="disk-desc">{{ disk.desc }}</p>
              <n-space vertical :size="4">
                <n-text depth="3" style="font-size: 12px">
                  空间大小：{{ disk.space }}
                </n-text>
                <n-text depth="3" style="font-size: 12px">
                  下载速度：{{ disk.speed }}
                </n-text>
              </n-space>
              <template #action>
                <n-button type="primary" block @click="handleGet(disk)">
                  立即注册
                </n-button>
              </template>
            </n-card>
          </n-gi>
        </n-grid>

        <n-empty v-if="filteredDisks.length === 0" description="暂无网盘" />
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

const disks = ref([
  { id: 1, icon: '☁️', name: '百度网盘', desc: '国内最大的网盘平台', space: '1024GB', speed: '普通', tag: '推荐', tagType: 'success' },
  { id: 2, icon: '📁', name: '阿里云盘', desc: '不限速，体验流畅', space: '2048GB', speed: '不限速', tag: '热门', tagType: 'error' },
  { id: 3, icon: '💾', name: '腾讯微云', desc: '与微信QQ深度整合', space: '10GB', speed: '普通', tag: '便捷', tagType: 'info' },
  { id: 4, icon: '📦', name: '115网盘', desc: '大容量，适合存储', space: '15TB', speed: '普通', tag: '大容量', tagType: 'warning' },
  { id: 5, icon: '🔐', name: '坚果云', desc: '同步盘，办公必备', space: '1GB/月', speed: '不限速', tag: '办公', tagType: 'success' },
  { id: 6, icon: '🌐', name: 'OneDrive', desc: '微软官方云存储', space: '5GB', speed: '不限速', tag: '国际', tagType: 'info' }
])

const filteredDisks = computed(() => {
  return disks.value.filter(disk => {
    return !searchQuery.value ||
      disk.name.includes(searchQuery.value) ||
      disk.desc.includes(searchQuery.value)
  })
})

function handleGet(disk) {
  message.success(`正在跳转到 ${disk.name}...`)
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

.disk-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.disk-icon {
  font-size: 1.5rem;
}

.disk-desc {
  color: var(--text-secondary, #666);
  margin: 0 0 0.5rem 0;
}
</style>

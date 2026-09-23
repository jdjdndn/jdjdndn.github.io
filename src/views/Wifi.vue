<template>
  <div class="app-wrapper">
    <SiteNav position="side" />
    <div id="app">
      <PageHero
        icon='<path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>'
        title="随身WiFi专区"
        subtitle="便携WiFi设备"
        aria="随身WiFi专区"
      />

      <n-card :bordered="false">
        <template #header>
          <div class="section-header">
            <span>WiFi设备</span>
            <n-text depth="3" style="font-size: 14px">
              共 {{ wifiDevices.length }} 款设备
            </n-text>
          </div>
        </template>

        <n-grid :cols="3" :x-gap="12" :y-gap="12" responsive="screen" item-responsive>
          <n-gi v-for="device in wifiDevices" :key="device.id" span="3 m:1">
            <n-card hoverable>
              <template #header>
                <div class="device-header">
                  <span class="device-icon">{{ device.icon }}</span>
                  <span>{{ device.name }}</span>
                </div>
              </template>
              <template #header-extra>
                <n-tag :type="device.tagType" size="small">
                  {{ device.tag }}
                </n-tag>
              </template>
              <p class="device-desc">{{ device.desc }}</p>
              <n-space vertical :size="4">
                <n-text depth="3" style="font-size: 12px">
                  流量：{{ device.data }}
                </n-text>
                <n-text depth="3" style="font-size: 12px">
                  价格：{{ device.price }}
                </n-text>
                <n-text depth="3" style="font-size: 12px">
                  信号：{{ device.signal }}
                </n-text>
              </n-space>
              <template #action>
                <n-button type="primary" block @click="handleBuy(device)">
                  立即购买
                </n-button>
              </template>
            </n-card>
          </n-gi>
        </n-grid>
      </n-card>

      <n-card title="常见问题" :bordered="false">
        <n-collapse>
          <n-collapse-item title="随身WiFi是什么？" name="1">
            随身WiFi是一种便携式无线网络设备，可以将有线网络转换为WiFi信号，方便在户外使用。
          </n-collapse-item>
          <n-collapse-item title="如何选择合适的套餐？" name="2">
            根据您的使用需求选择：轻度使用选10GB/月，中度使用选50GB/月，重度使用选100GB/月以上。
          </n-collapse-item>
          <n-collapse-item title="信号覆盖范围？" name="3">
            室内覆盖约10-20米，室外空旷地带可达50米以上，具体取决于设备型号和环境。
          </n-collapse-item>
        </n-collapse>
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

const wifiDevices = ref([
  { id: 1, icon: '📶', name: '4G随身WiFi', desc: '支持4G网络，便携小巧', data: '10GB/月', price: '29元/月', signal: '4G', tag: '热销', tagType: 'error' },
  { id: 2, icon: '🌐', name: '5G随身WiFi', desc: '支持5G网络，速度更快', data: '50GB/月', price: '99元/月', signal: '5G', tag: '新品', tagType: 'success' },
  { id: 3, icon: '🔋', name: '长续航WiFi', desc: '10小时续航，适合户外', data: '20GB/月', price: '49元/月', signal: '4G', tag: '续航', tagType: 'warning' },
  { id: 4, icon: '📱', name: '手机热点WiFi', desc: '无需额外设备，手机即可', data: '无限流量', price: '39元/月', signal: '4G', tag: '便捷', tagType: 'info' },
  { id: 5, icon: '🏢', name: '企业级WiFi', desc: '多人共享，适合团队', data: '100GB/月', price: '199元/月', signal: '5G', tag: '企业', tagType: 'success' },
  { id: 6, icon: '🌍', name: '国际漫游WiFi', desc: '支持多国网络，出国必备', data: '5GB/天', price: '25元/天', signal: '4G/5G', tag: '国际', tagType: 'info' }
])

function handleBuy(device) {
  message.success(`正在跳转到 ${device.name} 购买页面...`)
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

.device-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.device-icon {
  font-size: 1.5rem;
}

.device-desc {
  color: var(--text-secondary, #666);
  margin: 0 0 0.5rem 0;
}
</style>

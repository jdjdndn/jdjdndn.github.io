<template>
  <n-layout-sider
    v-if="position === 'side'"
    :collapsed="collapsed"
    :collapsed-width="64"
    :width="240"
    :native-scrollbar="false"
    :style="{ position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 100 }"
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <div class="nav-logo">
      <router-link to="/">
        <span class="logo-icon">🎫</span>
        <span v-if="!collapsed" class="logo-text">券宝</span>
      </router-link>
    </div>

    <n-menu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :value="activeKey"
      @update:value="handleMenuClick"
    />

    <template #footer>
      <div class="nav-footer">
        <n-button
          quaternary
          circle
          @click="toggleTheme"
          :aria-label="theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
        >
          <template #icon>
            <span>{{ theme === 'dark' ? '☀️' : '🌙' }}</span>
          </template>
        </n-button>
      </div>
    </template>
  </n-layout-sider>

  <!-- 页脚导航 -->
  <n-layout-footer
    v-if="position === 'footer'"
    bordered
    :style="{ padding: '1rem', textAlign: 'center' }"
  >
    <n-space justify="center" :wrap="true">
      <n-button
        v-for="link in navLinks"
        :key="link.path"
        text
        tag="router-link"
        :to="link.path"
      >
        {{ link.icon }} {{ link.name }}
      </n-button>
    </n-space>
  </n-layout-footer>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import {
  NLayoutSider,
  NLayoutFooter,
  NMenu,
  NButton,
  NSpace
} from 'naive-ui'
import { h } from 'vue'

const props = defineProps({
  position: {
    type: String,
    default: 'side',
    validator: (value) => ['side', 'footer'].includes(value)
  }
})

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 响应式：小屏自动折叠
const isMobile = ref(window.innerWidth < 768)
const collapsed = ref(isMobile.value)

const theme = computed(() => appStore.theme)

const navLinks = [
  { path: '/', name: '首页', icon: '🏠' },
  { path: '/haoka.html', name: '号卡办理', icon: '📱' },
  { path: '/wifi.html', name: '随身WiFi', icon: '📶' },
  { path: '/huodong.html', name: '优惠活动', icon: '🎉' },
  { path: '/huiyuan.html', name: '会员优惠', icon: '👑' },
  { path: '/about.html', name: '关于我们', icon: 'ℹ️' }
]

const menuOptions = navLinks.map(link => ({
  label: link.name,
  key: link.path,
  icon: () => h('span', null, link.icon)
}))

const activeKey = computed(() => route.path)

function handleMenuClick(key) {
  router.push(key)
  // 移动端点击后自动折叠
  if (isMobile.value) {
    collapsed.value = true
  }
}

function toggleTheme() {
  appStore.toggleTheme()
}

function handleResize() {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    collapsed.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.nav-logo {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #e5e5e5);
}

.nav-logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.logo-icon {
  font-size: 2rem;
  margin-right: 0.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
}

.nav-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color, #e5e5e5);
  text-align: center;
}
</style>

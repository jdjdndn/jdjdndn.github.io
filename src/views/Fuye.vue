<template>
  <div class="app-wrapper">
    <SiteNav position="side" />
    <div id="app">
      <PageHero
        icon='<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>'
        title="副业赚钱"
        subtitle="网络副业项目"
        aria="副业赚钱"
      />

      <n-card :bordered="false">
        <template #header>
          <div class="section-header">
            <span>副业项目</span>
            <n-text depth="3" style="font-size: 14px">
              共 {{ projects.length }} 个项目
            </n-text>
          </div>
        </template>

        <n-grid :cols="3" :x-gap="12" :y-gap="12" responsive="screen" item-responsive>
          <n-gi v-for="project in projects" :key="project.id" span="3 m:1">
            <n-card hoverable>
              <template #header>
                <div class="project-header">
                  <span class="project-icon">{{ project.icon }}</span>
                  <span>{{ project.name }}</span>
                </div>
              </template>
              <template #header-extra>
                <n-tag :type="project.tagType" size="small">
                  {{ project.tag }}
                </n-tag>
              </template>
              <p class="project-desc">{{ project.desc }}</p>
              <n-space vertical :size="4">
                <n-text depth="3" style="font-size: 12px">
                  收入预估：{{ project.income }}
                </n-text>
                <n-text depth="3" style="font-size: 12px">
                  难度：{{ project.difficulty }}
                </n-text>
              </n-space>
              <template #action>
                <n-button type="primary" block @click="handleJoin(project)">
                  了解详情
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

const projects = ref([
  { id: 1, icon: '📱', name: 'APP推广', desc: '推广APP获取佣金', income: '1000-5000元/月', difficulty: '简单', tag: '新手', tagType: 'success' },
  { id: 2, icon: '🛒', name: '电商分销', desc: '分享商品赚取佣金', income: '2000-10000元/月', difficulty: '中等', tag: '热门', tagType: 'error' },
  { id: 3, icon: '📝', name: '内容创作', desc: '创作内容获取收益', income: '500-8000元/月', difficulty: '中等', tag: '创意', tagType: 'warning' },
  { id: 4, icon: '🎓', name: '在线教育', desc: '分享知识赚取收入', income: '3000-20000元/月', difficulty: '困难', tag: '专业', tagType: 'info' },
  { id: 5, icon: '💻', name: ' freelance', desc: '自由职业接单', income: '5000-30000元/月', difficulty: '困难', tag: '高收入', tagType: 'success' },
  { id: 6, icon: '📊', name: '数据分析', desc: '数据处理与分析', income: '2000-15000元/月', difficulty: '中等', tag: '技术', tagType: 'info' }
])

function handleJoin(project) {
  message.success(`正在跳转到 ${project.name} 详情页...`)
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

.project-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.project-icon {
  font-size: 1.5rem;
}

.project-desc {
  color: var(--text-secondary, #666);
  margin: 0 0 0.5rem 0;
}
</style>

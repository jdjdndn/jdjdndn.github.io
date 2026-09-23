<template>
  <main class="haoka-agent-page">
    <PageHero
      icon='<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>'
      title="号卡代理合伙人"
      subtitle="高佣推广 · 一件代发 · 专业培训 · 持续售后"
      aria="号卡代理合伙人招募"
    >
      <template #badge>
        <span class="stat-badge">已帮助 <strong>2000+</strong> 代理</span>
        <span class="stat-badge">佣金高达 <strong>50%+</strong></span>
      </template>
    </PageHero>

    <!-- 代理招募 -->
    <section v-if="haokaProxyLinks.length" class="agent-section">
      <h2 class="seo-title">招募代理合伙人</h2>
      <p class="agent-desc">高佣推广 · 一件代发 · 专业培训 · 持续售后 · 已帮助 <strong>2000+</strong> 代理月入过万</p>
      <div class="agent-tags">
        <span class="agent-tag">佣金高达50%+</span>
        <span class="agent-tag">无需囤货</span>
        <span class="agent-tag">专业客服</span>
        <span class="agent-tag">推广素材</span>
      </div>
      <div class="agent-grid">
        <n-button v-for="proxy in haokaProxyLinks" :key="proxy.name" type="primary" tag="a" :href="proxy.url" target="_blank" rel="noopener sponsored" block>
          {{ proxy.name }}
        </n-button>
      </div>
    </section>

    <!-- 代理优势 -->
    <section class="agent-advantages">
      <h2 class="seo-title">代理优势</h2>
      <n-grid :cols="2" :x-gap="12" :y-gap="12" responsive="screen" item-responsive>
        <n-gi v-for="advantage in advantages" :key="advantage.id" span="2 m:1">
          <n-card hoverable>
            <template #header>
              <div class="advantage-header">
                <span class="advantage-icon">{{ advantage.icon }}</span>
                <span>{{ advantage.title }}</span>
              </div>
            </template>
            <p class="advantage-desc">{{ advantage.desc }}</p>
          </n-card>
        </n-gi>
      </n-grid>
    </section>

    <!-- 代理流程 -->
    <section class="agent-process">
      <h2 class="seo-title">代理流程</h2>
      <n-steps :current="currentStep" :status="currentStep === 3 ? 'success' : 'process'">
        <n-step title="注册账号" description="填写基本信息，完成注册" />
        <n-step title="获取推广链接" description="系统自动生成专属推广链接" />
        <n-step title="开始推广" description="分享链接，邀请用户办卡" />
        <n-step title="获得佣金" description="用户成功办卡，佣金到账" />
      </n-steps>
    </section>

    <!-- 立即加入 -->
    <section class="agent-register">
      <h2 class="seo-title">立即加入</h2>
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-form-item label="姓名" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入您的姓名" />
        </n-form-item>
        <n-form-item label="手机号" path="phone">
          <n-input v-model:value="formData.phone" placeholder="请输入手机号" />
        </n-form-item>
        <n-form-item label="推广渠道" path="channel">
          <n-select v-model:value="formData.channel" :options="channelOptions" placeholder="请选择推广渠道" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" block @click="handleSubmit">
            提交申请
          </n-button>
        </n-form-item>
      </n-form>
    </section>

    <LegalLinks />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import PageHero from '../../components/PageHero.vue'
import LegalLinks from '../../components/LegalLinks.vue'
import { haokaProxyLinks } from '../../haoka-data.js'

const message = useMessage()
const formRef = ref(null)
const currentStep = ref(1)

const formData = ref({
  name: '',
  phone: '',
  channel: null
})

const rules = {
  name: { required: true, message: '请输入姓名', trigger: 'blur' },
  phone: { required: true, message: '请输入手机号', trigger: 'blur' },
  channel: { required: true, message: '请选择推广渠道', trigger: 'change' }
}

const channelOptions = [
  { label: '社交媒体', value: 'social' },
  { label: '电商平台', value: 'ecommerce' },
  { label: '线下推广', value: 'offline' },
  { label: '其他', value: 'other' }
]

const advantages = ref([
  { id: 1, icon: '💰', title: '高佣金', desc: '佣金比例高达50%+，月入过万不是梦' },
  { id: 2, icon: '📦', title: '一件代发', desc: '无需囤货，用户下单直接发货' },
  { id: 3, icon: '📚', title: '专业培训', desc: '提供完整的推广培训和素材' },
  { id: 4, icon: '🛡️', title: '持续售后', desc: '专业客服团队，解决用户问题' }
])

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    message.success('申请提交成功，我们会尽快联系您！')
    formData.value = { name: '', phone: '', channel: null }
  } catch (errors) {
    message.error('请填写完整信息')
  }
}
</script>

<style scoped>
.agent-section {
  max-width: 1100px;
  margin: 40px auto;
  padding: 24px 16px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 16px;
  text-align: center;
}

.seo-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}

.agent-desc { font-size: 14px; color: var(--text-secondary, #6b7280); margin-bottom: 16px; }

.agent-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.agent-tag {
  padding: 6px 14px;
  background: var(--primary-light, #FFF4ED);
  color: var(--primary, #FF6B35);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.agent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
}

.agent-advantages {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 16px;
}

.advantage-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.advantage-icon {
  font-size: 1.5rem;
}

.advantage-desc {
  color: var(--text-secondary, #666);
  margin: 0;
}

.agent-process {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 16px;
}

.agent-register {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 16px;
}

[data-theme="dark"] .agent-section {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}
</style>

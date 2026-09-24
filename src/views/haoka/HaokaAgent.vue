<template>
  <main class="haoka-agent-page">
    <PageHero
      icon='<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>'
      title="号卡代理合伙人"
      subtitle="高佣推广 · 零成本加入 · 专业培训 · 持续售后"
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
      <p class="agent-desc">一件代发免囤货 · 专业客服全程带教 · 已帮助 <strong>2000+</strong> 代理月入过万</p>
      <div class="agent-tags">
        <span class="agent-tag">佣金高达50%+</span>
        <span class="agent-tag">无需囤货</span>
        <span class="agent-tag">专业客服</span>
        <span class="agent-tag">推广素材</span>
      </div>
      <div class="agent-grid">
        <a v-for="proxy in haokaProxyLinks" :key="proxy.name" class="btn btn-primary btn-block" :href="proxy.url" target="_blank" rel="noopener sponsored">
          {{ proxy.name }}
        </a>
      </div>
    </section>

    <!-- 代理优势 -->
    <section class="agent-advantages">
      <h2 class="seo-title">代理优势</h2>
      <div class="grid-2">
        <div v-for="advantage in advantages" :key="advantage.id" class="grid-item">
          <div class="card hoverable">
            <div class="advantage-header">
              <span class="advantage-icon">{{ advantage.icon }}</span>
              <span>{{ advantage.title }}</span>
            </div>
            <p class="advantage-desc">{{ advantage.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 代理流程 -->
    <section class="agent-process">
      <h2 class="seo-title">代理流程</h2>
      <div class="steps">
        <div v-for="(step, i) in processSteps" :key="i" class="step" :class="{ active: currentStep > i, success: currentStep === 4 }">
          <div class="step-indicator">{{ currentStep > i ? '✓' : i + 1 }}</div>
          <div class="step-content">
            <div class="step-title">{{ step.title }}</div>
            <div class="step-desc">{{ step.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 立即加入 -->
    <section class="agent-register">
      <h2 class="seo-title">立即加入</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>姓名</label>
          <input v-model="formData.name" type="text" placeholder="请输入您的姓名" />
        </div>
        <div class="form-group">
          <label>手机号</label>
          <input v-model="formData.phone" type="tel" placeholder="请输入手机号" />
        </div>
        <div class="form-group">
          <label>推广渠道</label>
          <select v-model="formData.channel">
            <option :value="null" disabled>请选择推广渠道</option>
            <option v-for="opt in channelOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary btn-block">提交申请</button>
      </form>
    </section>

    <LegalLinks />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { inject } from 'vue'
import PageHero from '../../components/PageHero.vue'
import LegalLinks from '../../components/LegalLinks.vue'
import { haokaProxyLinks } from '../../templates/haoka-data.js'

const toast = inject('toast')
const currentStep = ref(1)

const formData = ref({
  name: '',
  phone: '',
  channel: null
})

const channelOptions = [
  { label: '社交媒体', value: 'social' },
  { label: '电商平台', value: 'ecommerce' },
  { label: '线下推广', value: 'offline' },
  { label: '其他', value: 'other' }
]

const processSteps = [
  { title: '注册账号', desc: '填写基本信息，完成注册' },
  { title: '获取推广链接', desc: '系统自动生成专属推广链接' },
  { title: '开始推广', desc: '分享链接，邀请用户办卡' },
  { title: '获得佣金', desc: '用户成功办卡，佣金到账' }
]

const advantages = ref([
  { id: 1, icon: '💰', title: '高佣金', desc: '佣金比例高达50%+，月入过万不是梦' },
  { id: 2, icon: '📦', title: '一件代发', desc: '无需囤货，用户下单直接发货' },
  { id: 3, icon: '📚', title: '专业培训', desc: '提供完整的推广培训和素材' },
  { id: 4, icon: '🛡️', title: '持续售后', desc: '专业客服团队，解决用户问题' }
])

function handleSubmit() {
  if (!formData.value.name || !formData.value.phone || !formData.value.channel) {
    toast?.('请填写完整信息', 'error')
    return
  }
  toast?.('申请提交成功，我们会尽快联系您！', 'success')
  formData.value = { name: '', phone: '', channel: null }
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

.card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
  padding: 20px;
}

.card.hoverable:hover {
  border-color: var(--primary, #FF6B35);
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.1);
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 768px) {
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

.grid-item {
  min-width: 0;
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

.steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--muted-bg, #f3f4f6);
  color: var(--muted, #6b7280);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  transition: all 0.2s;
}

.step.active .step-indicator {
  background: var(--primary, #FF6B35);
  color: #fff;
}

.step.success .step-indicator {
  background: var(--success, #16a34a);
  color: #fff;
}

.step-content {
  padding-top: 4px;
}

.step-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
}

.step-desc {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.agent-register {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text, #1a1a2e);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 8px;
  font-size: 14px;
  background: var(--card, #fff);
  color: var(--text, #1a1a2e);
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--primary, #FF6B35);
}

.form-group input::placeholder {
  color: var(--placeholder, #b0aaa0);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border: none;
}

.btn-primary {
  background: var(--primary, #FF6B35);
  color: #fff;
}

.btn-primary:hover {
  background: var(--primary-dark, #e55a2b);
}

.btn-block {
  display: flex;
  width: 100%;
}

[data-theme="dark"] .agent-section {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .card {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .step-indicator {
  background: var(--muted-bg, #2d2d45);
  color: var(--muted, #a0aec0);
}

[data-theme="dark"] .form-group input,
[data-theme="dark"] .form-group select {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
  color: var(--text, #e5e2dd);
}
</style>

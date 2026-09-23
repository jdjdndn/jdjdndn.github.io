<template>
  <main class="privacy-page">
    <PageHero
      icon='<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'
      title="隐私政策"
      subtitle="隐私政策 · 你的信息如何被保护"
      aria="隐私政策"
    />

    <div class="privacy-wrap">
      <!-- 目录 -->
      <nav class="privacy-toc" aria-label="隐私政策目录">
        <a v-for="(section, i) in sections" :key="i" :href="'#p' + (i + 1)">
          <span class="privacy-num">{{ i + 1 }}</span>
          {{ section.title }}
        </a>
      </nav>

      <!-- 第1节：信息收集 -->
      <section class="privacy-card" id="p1">
        <h2 class="privacy-title"><span class="privacy-num">1</span>我们收集哪些信息</h2>
        <p class="privacy-highlight">
          本站（优惠活动聚合，下称"本站"）是优惠信息导航平台，<strong>不要求注册、不要求登录，不收集您的姓名、手机号、邮箱、收货地址等任何可识别个人身份的信息</strong>。
        </p>
        <p>您访问本站时，以下信息可能会被收集：</p>
        <ul class="privacy-list">
          <li>
            <span class="privacy-icon">🖥️</span>
            <div>
              <strong>访问统计</strong>
              <span>本站使用 Umami Analytics 进行匿名访问统计（页面浏览数、来源、设备类型、大致地区）。Umami 为隐私友好型统计工具，不设置跟踪 Cookie，不采集您的个人身份信息。</span>
            </div>
          </li>
          <li>
            <span class="privacy-icon">💾</span>
            <div>
              <strong>浏览器本地存储（localStorage）</strong>
              <span>用于记住您的界面偏好与浏览状态，包括暗色模式选择、上次浏览的分类页、文章列表页码、已读引导提示等。这些数据仅保存在您的设备上，不会被上传。</span>
            </div>
          </li>
        </ul>
      </section>

      <!-- 第2节：Cookie -->
      <section class="privacy-card" id="p2">
        <h2 class="privacy-title"><span class="privacy-num">2</span>Cookie 与本地存储</h2>
        <p>本站本身不设置广告跟踪 Cookie。上述本地存储数据仅用于改善您的浏览体验，您随时可以通过浏览器设置清除站点数据。清除后，界面偏好与浏览记录将被重置，但不影响任何正常功能。</p>
      </section>

      <!-- 第3节：第三方链接 -->
      <section class="privacy-card" id="p3">
        <h2 class="privacy-title"><span class="privacy-num">3</span>第三方链接与推广说明</h2>
        <p>本站收录的优惠活动均跳转至京东、淘宝、拼多多、美团、携程、同程、飞猪等第三方平台。您点击跳转后，将由对应平台收集和使用您的信息，其处理方式请以各平台的隐私政策为准，本站对此不承担控制或责任。</p>
      </section>

      <!-- 第4节：信息安全 -->
      <section class="privacy-card" id="p4">
        <h2 class="privacy-title"><span class="privacy-num">4</span>信息安全</h2>
        <p>由于本站不收集个人身份信息，不存在存储个人数据的场景。建议您通过本站跳转至第三方平台时，注意甄别页面真实性，不在可疑页面输入个人信息。</p>
      </section>

      <!-- 第5节：未成年人保护 -->
      <section class="privacy-card" id="p5">
        <h2 class="privacy-title"><span class="privacy-num">5</span>未成年人保护</h2>
        <p>本站内容面向一般公众。若您为未成年人，请在监护人陪同下浏览本站，并谨慎进行任何线上消费。</p>
      </section>

      <!-- 第6节：政策更新 -->
      <section class="privacy-card" id="p6">
        <h2 class="privacy-title"><span class="privacy-num">6</span>政策的更新</h2>
        <p>本隐私政策可能随网站功能或法规要求进行调整，更新后的政策将在本页面发布并更新生效日期。重大变更我们会通过站内提示告知。</p>
        <p>生效日期：2026年9月22日。</p>
      </section>

      <!-- 第7节：联系我们 -->
      <section class="privacy-card" id="p7">
        <h2 class="privacy-title"><span class="privacy-num">7</span>联系我们</h2>
        <p>
          如对本隐私政策、优惠信息准确性或任何内容有疑问、建议，或发现链接失效、信息有误，欢迎通过
          <router-link to="/about.html">关于我们页面的联系方式</router-link>反馈，我们会在收到后尽快处理。
        </p>
      </section>

      <div class="privacy-back">
        <router-link to="/" class="btn-primary">← 返回首页</router-link>
        <router-link to="/about.html" class="btn-ghost">关于我们</router-link>
        <router-link to="/about.html#contact" class="btn-ghost">📮 纠错 / 失效反馈</router-link>
      </div>
    </div>

    <LegalLinks />
  </main>
</template>

<script setup>
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'

const sections = [
  { title: '信息收集' },
  { title: 'Cookie 与本地存储' },
  { title: '第三方链接与推广' },
  { title: '信息安全' },
  { title: '未成年人保护' },
  { title: '政策更新' },
  { title: '联系我们' }
]
</script>

<style scoped>
.privacy-wrap {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 目录 */
.privacy-toc {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
  padding: 16px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
}

.privacy-toc a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-secondary, #4a5568);
  text-decoration: none;
  transition: all 0.2s;
}

.privacy-toc a:hover {
  background: var(--hover-bg, #f5f4f1);
  color: var(--primary, #FF6B35);
}

/* 章节卡片 */
.privacy-card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
}

.privacy-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: var(--text, #1a1a2e);
  margin-bottom: 16px;
}

.privacy-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: var(--primary-light, #FFF4ED);
  color: var(--primary, #FF6B35);
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.privacy-card p {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary, #4a5568);
  margin-bottom: 12px;
}

.privacy-card p:last-child {
  margin-bottom: 0;
}

.privacy-highlight {
  padding: 12px 16px;
  background: var(--primary-light, #FFF4ED);
  border-left: 3px solid var(--primary, #FF6B35);
  border-radius: 0 8px 8px 0;
}

/* 列表 */
.privacy-list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}

.privacy-list li {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light, #f0eeeb);
}

.privacy-list li:last-child {
  border-bottom: none;
}

.privacy-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.privacy-list li div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.privacy-list li strong {
  font-size: 14px;
  color: var(--text, #1a1a2e);
}

.privacy-list li span {
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary, #4a5568);
}

/* 底部按钮 */
.privacy-back {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 32px 0;
  padding: 24px 0;
  border-top: 1px solid var(--border, #e5e2dd);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background: var(--primary, #FF6B35);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--primary-hover, #E55A2B);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background: transparent;
  color: var(--text-secondary, #4a5568);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-ghost:hover {
  border-color: var(--primary, #FF6B35);
  color: var(--primary, #FF6B35);
}

/* 暗色模式 */
[data-theme="dark"] .privacy-card {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}

[data-theme="dark"] .privacy-toc {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}
</style>

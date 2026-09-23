<template>
  <div class="app-wrapper">
    <SiteNav position="side" />
    <div id="app">
      <PageHero
        icon='<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>'
        title="隐私政策"
        subtitle="券宝隐私说明"
        aria="隐私政策"
      />

      <n-card :bordered="false">
        <n-space vertical :size="24">
          <n-card title="信息收集" size="small">
            <n-text>
              我们可能收集以下信息：
            </n-text>
            <n-list :show-divider="true">
              <n-list-item>
                <n-thing title="设备信息" description="设备型号、操作系统版本、浏览器类型" />
              </n-list-item>
              <n-list-item>
                <n-thing title="日志信息" description="访问时间、浏览页面、点击行为" />
              </n-list-item>
              <n-list-item>
                <n-thing title="位置信息" description="IP地址、地理位置（如授权）" />
              </n-list-item>
            </n-list>
          </n-card>

          <n-card title="信息使用" size="small">
            <n-text>
              我们使用收集的信息用于：
            </n-text>
            <n-list :show-divider="true">
              <n-list-item>
                <n-thing title="提供服务" description="为您提供优惠信息推荐" />
              </n-list-item>
              <n-list-item>
                <n-thing title="改善体验" description="优化页面设计和功能" />
              </n-list-item>
              <n-list-item>
                <n-thing title="安全保障" description="防止恶意攻击和欺诈行为" />
              </n-list-item>
            </n-list>
          </n-card>

          <n-card title="信息保护" size="small">
            <n-text>
              我们采取以下措施保护您的信息：
            </n-text>
            <n-list :show-divider="true">
              <n-list-item>
                <n-thing title="数据加密" description="使用SSL/TLS加密传输数据" />
              </n-list-item>
              <n-list-item>
                <n-thing title="访问控制" description="严格限制员工访问用户数据" />
              </n-list-item>
              <n-list-item>
                <n-thing title="安全审计" description="定期进行安全检查和漏洞修复" />
              </n-list-item>
            </n-list>
          </n-card>

          <n-card title="第三方服务" size="small">
            <n-text>
              我们可能使用第三方服务，这些服务有各自的隐私政策：
            </n-text>
            <n-list :show-divider="true">
              <n-list-item>
                <n-thing title="分析工具" description="用于统计访问量和用户行为" />
              </n-list-item>
              <n-list-item>
                <n-thing title="广告平台" description="用于展示相关广告（如适用）" />
              </n-list-item>
            </n-list>
          </n-card>

          <n-card title="联系我们" size="small">
            <n-text>
              如有任何隐私相关问题，请通过以下方式联系我们：
            </n-text>
            <n-space vertical :size="8">
              <n-text>邮箱：privacy@jdjdndn.github.io</n-text>
              <n-text>我们会尽快回复您的查询</n-text>
            </n-space>
          </n-card>

          <n-card title="政策更新" size="small">
            <n-text>
              我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，并注明生效日期。建议您定期查看本页面以了解最新信息。
            </n-text>
          </n-card>
        </n-space>
      </n-card>

      <LegalLinks />
    </div>
    <SiteNav position="footer" />
  </div>
</template>

<script setup>
import SiteNav from '../components/SiteNav.vue'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'
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
</style>

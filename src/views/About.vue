<template>
  <main class="about-page">
      <PageHero
        icon='<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
        title="关于我们"
        subtitle="关于券宝 · 优惠聚合平台"
        aria="关于我们"
      />

      <n-card title="平台介绍" :bordered="false">
        <n-space vertical :size="16">
          <n-text>
            券宝是一个一站式优惠券导航站，收录全网热门优惠活动，覆盖美团外卖、淘宝闪购、京东、拼多多、携程/同程/飞猪酒店旅行、滴滴出行、连锁餐饮、电影票、快递寄件等场景。
          </n-text>
          <n-text>
            我们致力于为用户提供最全面、最及时的优惠信息，帮助用户省钱省心。复制口令码或点击链接即可跳转领取，每天更新。
          </n-text>
        </n-space>
      </n-card>

      <n-card title="联系我们" :bordered="false">
        <n-space vertical :size="16">
          <n-text>
            如有疑问或合作意向，欢迎通过以下方式联系我们：
          </n-text>
          <n-space vertical :size="12">
            <n-text strong>QQ：2667389861</n-text>
            <n-text strong>微信：wcbblll</n-text>
          </n-space>
        </n-space>
      </n-card>

      <n-card :bordered="false">
        <template #header>
          <div class="faq-header">
            <span>常见问题</span>
          </div>
        </template>
        <n-collapse>
          <n-collapse-item title="券宝是什么？" name="1">
            券宝是一个一站式优惠券导航站，收录全网热门优惠活动，覆盖美团外卖、淘宝闪购、京东、拼多多等主流平台。
          </n-collapse-item>
          <n-collapse-item title="如何使用优惠口令码？" name="2">
            两步即可领取：1) 在本站点击复制口令按钮复制口令码；2) 打开对应App（美团/淘宝/京东等），口令自动识别并跳转到领取页面。
          </n-collapse-item>
          <n-collapse-item title="本站收录了哪些平台的优惠？" name="3">
            本站收录了美团外卖、淘宝闪购、京东、拼多多、携程旅行、同程旅行、飞猪出行、滴滴出行等主流平台的优惠活动，以及肯德基、瑞幸咖啡、星巴克等连锁餐饮品牌的优惠券。
          </n-collapse-item>
          <n-collapse-item title="优惠信息多久更新一次？" name="4">
            我们每天都会更新优惠信息，确保用户获取到最新的优惠活动。部分热门活动会实时更新。
          </n-collapse-item>
        </n-collapse>
      </n-card>

      <LegalLinks />
  </main>
</template>

<script setup>
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'
</script>

<style scoped>
.faq-header {
  font-size: 1.25rem;
  font-weight: 600;
}
</style>

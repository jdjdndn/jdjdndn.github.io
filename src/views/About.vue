<template>
  <main class="about-page">
      <PageHero
        icon='<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
        title="关于我们"
        subtitle="关于券宝 · 优惠聚合平台"
        aria="关于我们"
      />

      <div class="card">
        <h3 class="card-title">平台介绍</h3>
        <div class="space-v">
          <p>
            券宝是一个一站式优惠券导航站，收录全网热门优惠活动，覆盖美团外卖、淘宝闪购、京东、拼多多、携程/同程/飞猪酒店旅行、滴滴出行、连锁餐饮、电影票、快递寄件等场景。
          </p>
          <p>
            我们致力于为用户提供最全面、最及时的优惠信息，帮助用户省钱省心。复制口令码或点击链接即可跳转领取，每天更新。
          </p>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">联系我们</h3>
        <div class="space-v">
          <p>
            如有疑问或合作意向，欢迎通过以下方式联系我们：
          </p>
          <div class="space-v-sm">
            <strong>QQ：2667389861</strong>
            <strong>微信：wcbblll</strong>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">常见问题</h3>
        <div class="faq-list">
          <details class="faq-item">
            <summary class="faq-question">券宝是什么？</summary>
            <div class="faq-answer">
              券宝是一个一站式优惠券导航站，收录全网热门优惠活动，覆盖美团外卖、淘宝闪购、京东、拼多多等主流平台。
            </div>
          </details>
          <details class="faq-item">
            <summary class="faq-question">如何使用优惠口令码？</summary>
            <div class="faq-answer">
              两步即可领取：1) 在本站点击复制口令按钮复制口令码；2) 打开对应App（美团/淘宝/京东等），口令自动识别并跳转到领取页面。
            </div>
          </details>
          <details class="faq-item">
            <summary class="faq-question">本站收录了哪些平台的优惠？</summary>
            <div class="faq-answer">
              本站收录了美团外卖、淘宝闪购、京东、拼多多、携程旅行、同程旅行、飞猪出行、滴滴出行等主流平台的优惠活动，以及肯德基、瑞幸咖啡、星巴克等连锁餐饮品牌的优惠券。
            </div>
          </details>
          <details class="faq-item">
            <summary class="faq-question">优惠信息多久更新一次？</summary>
            <div class="faq-answer">
              我们每天都会更新优惠信息，确保用户获取到最新的优惠活动。部分热门活动会实时更新。
            </div>
          </details>
        </div>
      </div>

      <LegalLinks />
  </main>
</template>

<script setup>
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'
</script>

<style scoped>
.card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: var(--radius, 12px);
  padding: 20px;
}
.card-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text, #1a1a2e);
  margin-bottom: 16px;
}
.space-v { display: flex; flex-direction: column; gap: 16px; }
.space-v-sm { display: flex; flex-direction: column; gap: 12px; }
.faq-list { margin-top: 24px; }
</style>

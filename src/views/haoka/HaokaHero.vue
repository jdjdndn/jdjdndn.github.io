<template>
    <PageHero
      icon='<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>'
      title="号卡办理专区"
      subtitle="流量卡 · 四网可选 · 正规运营商授权"
      aria="号卡办理专区"
    >
      <template #badge>
        <span class="stat-badge">已收录 <strong>7</strong> 个平台</span>
        <span class="stat-badge">已服务 <strong>1万+</strong> 用户</span>
      </template>
    </PageHero>

  <section class="haoka-hero">
    <!-- 选卡指南 -->
    <div class="hero-section">
      <h2 class="hero-title">如何选对号卡</h2>
      <div class="guide-grid">
        <div v-for="(guide, i) in 选卡指南" :key="i" class="guide-card">
          <span class="guide-step">{{ i + 1 }}</span>
          <div class="guide-content">
            <h3>{{ guide.title }}</h3>
            <p>{{ guide.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 运营商对比 -->
    <div class="hero-section">
      <h2 class="hero-title">四大运营商怎么选</h2>
      <div class="guide-grid">
        <div v-for="carrier in 运营商" :key="carrier.name" class="guide-card">
          <span class="guide-step" :style="{ background: carrier.bg, color: carrier.color }">{{ carrier.abbr }}</span>
          <div class="guide-content">
            <h3>{{ carrier.name }}</h3>
            <p>{{ carrier.desc }}</p>
          </div>
        </div>
      </div>
      <p class="hero-note">以上平台均支持四网套餐，办理时可自行选择运营商。</p>
    </div>

    <!-- FAQ -->
    <div class="hero-section">
      <h2 class="hero-title">大家还在问</h2>
      <div class="faq-list">
        <details v-for="(faq, i) in faqs" :key="i" class="faq-item">
          <summary class="faq-question">{{ faq.q }}</summary>
          <div class="faq-answer">{{ faq.a }}</div>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup>
const 选卡指南 = [
  { title: '看运营商信号', desc: '先确认你所在地区哪个运营商信号好。移动覆盖最广，联通城市网速快，电信南方覆盖强，广电压高省份有优势。' },
  { title: '算流量够不够', desc: '日常刷视频选 100G+，轻度使用 30-50G 够用。注意区分"通用流量"和"定向流量"，通用流量才是真金白银。' },
  { title: '问清配送范围', desc: '不同号卡配送范围不同，下单前在办理页面确认你的收货地址是否支持配送，避免白忙一场。' },
  { title: '注意合约期', desc: '部分优惠套餐有 6-24 个月合约期，提前销户可能有违约金。短期用选无合约或短合约的套餐更灵活。' }
]

const 运营商 = [
  { name: '中国电信', abbr: '电', bg: '#E6F0FF', color: '#0060AC', desc: '南方覆盖强，上传快延迟低，适合直播和南方用户。套餐 19-49 元/月。' },
  { name: '中国联通', abbr: '联', bg: '#FFE6E6', color: '#E60012', desc: '城市网速快，游戏延迟低，适合城市用户和游戏玩家。套餐 19-39 元/月。' },
  { name: '中国移动', abbr: '移', bg: '#E6F9EE', color: '#00A651', desc: '全国覆盖最广，信号最稳，适合经常出差和偏远地区用户。套餐 29-59 元/月。' },
  { name: '中国广电', abbr: '广', bg: '#F3E8FF', color: '#7B2D8E', desc: '700MHz 穿墙强，依托移动基站，性价比高。套餐 19-39 元/月。' }
]

const faqs = [
  { q: '号卡办理需要什么条件？', a: '办理号卡通常需要年满18周岁，提供有效身份证件（身份证）。部分号卡支持线上办理，收到SIM卡后按指引激活即可使用。不同运营商和地区可能有额外要求，具体以办理页面说明为准。' },
  { q: '流量卡和普通手机卡有什么区别？', a: '流量卡主要面向大流量需求的用户，通常提供更多的全国通用流量，月租更低。普通手机卡则通话分钟数较多。选择时应根据自身使用习惯：如果主要上网，选流量卡更划算；如果需要大量通话，选传统套餐。' },
  { q: '网上办理的号卡安全可靠吗？', a: '通过正规授权平台办理的号卡是安全可靠的。本专区收录的号卡平台均为运营商正规授权渠道，与线下营业厅办理的号卡具有相同质量保障。收到卡后可通过运营商官方APP查询套餐详情。' },
  { q: '号卡都支持全国配送吗？', a: '不同号卡平台的配送范围不同。部分号卡支持全国配送，部分号卡仅限特定地区。具体配送范围以各平台办理页面说明为准，下单前请确认收货地址是否在配送范围内。' },
  { q: '如何选择适合自己的号卡？', a: '选择号卡建议考虑以下因素：1) 流量需求——日常使用选30-100G，重度用户选100G以上；2) 月租预算——号卡月租普遍在19-49元区间；3) 网络偏好——移动/联通/电信各有覆盖优势；4) 合约期限——部分优惠套餐有合约期，注意查看。' }
]
</script>

<style scoped>
.haoka-hero {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
}

.hero-section {
  margin-bottom: 32px;
}

.hero-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.guide-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
}

.guide-step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-light, #FFF4ED);
  color: var(--primary, #FF6B35);
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.guide-content h3 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.guide-content p { font-size: 13px; color: var(--text-secondary, #6b7280); line-height: 1.6; margin: 0; }

.hero-note { font-size: 12px; color: var(--muted, #6b7280); margin-top: 10px; }

/* FAQ */
.faq-list { display: flex; flex-direction: column; gap: 8px; }

.faq-item {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e2dd);
  border-radius: 12px;
  overflow: hidden;
}

.faq-question {
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}

.faq-question::-webkit-details-marker { display: none; }

.faq-answer {
  padding: 0 16px 14px;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.7;
}

[data-theme="dark"] .guide-card,
[data-theme="dark"] .faq-item {
  background: var(--card, #1e1e35);
  border-color: var(--border, #2d2d45);
}
</style>

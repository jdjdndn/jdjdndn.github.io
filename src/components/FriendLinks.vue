<template>
  <div class="friend-links-wrapper">
    <div class="fl-header">
      <h3>🔗 友情链接</h3>
      <p>更多优惠资源与实用工具，一站直达</p>
    </div>
    <div class="fl-grid-container">
      <div v-for="section in friendLinksData" :key="section.title" class="fl-section">
        <div class="fl-title">{{ section.title }}</div>
        <div class="fl-list">
          <a
            v-for="link in section.links"
            :key="link.name"
            class="fl-link"
            :href="link.url"
            target="_blank"
            rel="noopener"
          >
            <span class="fl-name">{{ link.name }}</span>
            <span class="fl-desc">{{ link.desc }}</span>
          </a>
        </div>
      </div>
    </div>
    <div class="fl-footer">
      © 券宝省钱攻略 · 帮你花少钱过好生活
    </div>
  </div>
</template>

<script setup>
const friendLinksData = [
  {
    title: '🛒 电商优惠',
    links: [
      { name: '京东小首页', url: 'https://union-click.jd.com/jdc?e=618%7Cpc%7C&p=JF8BAPIJK1olXDYDZBoCUBVIMzZNXhpXVhgcDwYCXhxDXHBTTkRHA1ocDBsJVEVTbT9aXjVUUUJdDAACFBtFRjdPQx5dSkJdDAACZgpHVTtmQw4ZXgcHUl5eOC5vQzdhZzoQPmNeKzYnfjxtWx9vcDsZUTYDZF1cCk4TBm0KGF8lbQYBZBUzCXsVA24JE18WVAEDZF5bAUIeAWoJHl4cWQ8yU15UOA1CfxBeeiFyIlNcDxYVOHsnAF8PG1IBW3RDBkpbensnAG84GGslXwcDUFdtOJWasxV7bwJRXHRxABwjSkpERBrWlusEIXELUFpZGXsnM18JKw', desc: '京东优惠入口' },
      { name: '京东秒杀', url: 'https://union-click.jd.com/jdc?e=618%7Cpc%7C&p=JF8BAPEJK1olXDYDZBoCUBVIMzZNXhpXVhgcDwYCXhxDXHBTTkRHA1ocDBsJVEVTbT9aXjVUUUJdDAACFBtFRjdPQx5dSkJdDAACZgpHVTtmQw4XgYGUlltdQN_QCdqZRNwHgVhXC4EchFOVxd0TVcZbQcyV19fDU8SAW0LH2slXQUyHzBcOEkXAm4AH1gcWgcyVFhUAUIVBm8AH10VXjYFVFdtTh5rfDlpYTxqCFhZHBZtOHsUM2gIEk8TL0dQQFgvOHsUA18LK2sXXAcGXW5t1sana2prWyMWGnlLClscfxlpBbGFq0pnLQYGVVhMOHsnM244', desc: '限时抢购' },
      { name: '淘宝领券中心', url: 'https://s.click.taobao.com/t?union_lens=lensId%3APUB%401789269805%40212ab4cc_0dfe_1a098ca8a6d_9c53%4001%40eyJmbG9vcklkIjozODg1Miiwiic3BtQiiI6Il9wb3J0YWxfdjJfcGFnZXNfYWN0aXZpdHlfb2ZmaWNpYWxfaW5kZXhfaHRtIn0ie%3BeventPageId%3A20150318020020616&e=m%3D2%26s%3DdofwPaEQFc9w4vFB6t2Z2iperVdZeJviU%2F9%2F0taeK29yINtkUhsv0O2iwoeoDO941TWny6gsEi9SuewCsBSbS6oN95bG9f%2BFUZHYLBVvqBh2JFnLDKcohCUZ%2FJYwIzSxAGIx0oe2X2hZfJ7ZQxC1%2Fb%2BmvmXqUq2iEBnEBk3xaGylLmcSHKfaX1CIFRJhZoJ2keMqUwSQcLSwn1IXvusdyogaseAKBk0cEzJFLUun%2BFGDWrJcI%2B9mMkt2lYwodYMFf7Le49%2F8qY%2BP%2BRk9cvLur6lBjBYgj4%2Fi7QrH1tUnPyWfF2mNtOHXW%2B%2F9SMD5NOKOiuzH7pZzJf0rOVsz%2BkILKYgPh2VpbvcT8PwOkD4ulZfxvNaaibhIncDlE6H93yEw17wnkme1OdGDcT9IgYeWF%2FeiVvaEiF03Z3NEK3xpqJbw0Xjr6aTmzBqXZ8Yqn2bkhplvaBfrg%2B6seY1jg6ngqFhtB%2Fl3JjVuBcmuj8A3AXOK%2F7ip5Dhfd0Tkaz0EsryRaKfxHmzWgJfGDmntuH4VtA%3D%3D', desc: '隐藏优惠券' },
      { name: '拼多多百亿补贴', url: 'https://mobile.yangkeduo.com/muti_coupon_rec.html?_pdd_fs=1&__page=ddjb_act_coupon_adv&__mav2=1&traffic=web_gen_url&pid=40353314_284993965&cpsSign=ZXMP_260908_40353314_284993965_59608ad4810c06f4f217e0510038efd6&_x_ddjb_act=%7B%22st%22%3A%22168%22%7D&traffic=prom&duoduo_type=2', desc: '品牌正品低价' },
      { name: '苏宁易购', url: 'https://tb.jiuxinban.com/CK1W4u', desc: '综合电商优惠' },
      { name: '当当网', url: 'https://tb.jiuxinban.com/CK1W9y', desc: '图书优惠' },
      { name: '1688', url: 'https://tb.jiuxinban.com/CK1Vl5', desc: '批发优惠' },
    ],
  },
  {
    title: '🍜 外卖餐饮',
    links: [
      { name: '美团本地生活', url: 'https://kurl07.cn/te2qe9', desc: '美团优惠集合' },
      { name: '京东外卖', url: 'https://1.yoourl.net/link/10009836aafbeff4e2171002ArLVtpn4', desc: '外卖优惠' },
      { name: '电影票', url: 'weixin://dl/business/?t=f6MDcoTPZpe', desc: '微信快捷购票' },
      { name: '花店', url: 'https://wxmpurl.cn/AOPNUIe3tHa', desc: '鲜花预订配送' },
      { name: '寄快递', url: 'https://kurl06.cn/txh9El', desc: '多家快递比价' },
      { name: '上门回收', url: 'weixin://dl/business/?appid=wx3f0209cc35a953a4&path=wjyk_recycle/pages/index/index&query=scene%3D23542300', desc: '旧机回收' },
    ],
  },
  {
    title: '✈️ 出行旅行',
    links: [
      { name: '携程酒店', url: 'https://t.ctrip.cn/pVufKgm', desc: '全球酒店预订' },
      { name: '携程机票', url: 'https://t.ctrip.cn/03rFSgB', desc: '国内国际机票' },
      { name: '携程门票', url: 'https://t.ctrip.cn/qPkFGHj', desc: '当天可定' },
      { name: '同程酒店', url: 'https://s.ly.com/Hsx2zm6eB', desc: '酒店优惠' },
      { name: '同程火车票', url: 'https://s.ly.com/xscLym6Jj', desc: '极速抢票' },
    ],
  },
  {
    title: '👑 影视会员',
    links: [
      { name: '影视VIP会员', url: 'https://wcbblll.99kami.com', desc: '爱奇艺/腾讯/芒果/优酷' },
      { name: '音乐VIP会员', url: 'https://wcbblll.im01.cn', desc: 'QQ音乐/网易云/汽水' },
      { name: '福来流量站', url: 'http://35568.qcxmt.cn', desc: '粉丝关注服务' },
    ],
  },
  {
    title: '💾 网盘资源',
    links: [
      { name: '亚马逊电子书7000本', url: 'https://pan.quark.cn/s/88272c47ef63', desc: '夸克网盘' },
      { name: 'AIGC课程合集', url: 'https://pan.baidu.com/s/1QEOUa8twpSxut5_DX4LOMg?pwd=63fh', desc: '百度网盘' },
      { name: '自媒体运营教程', url: 'https://pan.baidu.com/s/13Xt8KNDzFWdX8Ock8wyBeA?pwd=xkqq', desc: '百度网盘' },
      { name: '99套小吃配方', url: 'https://pan.quark.cn/s/fe9df038e605', desc: '夸克网盘' },
      { name: '490张音乐专辑', url: 'https://pan.quark.cn/s/e5a0db5fb51e', desc: '夸克网盘' },
      { name: '车载MV资源', url: 'https://pan.quark.cn/s/eaf8e764baeb', desc: '夸克网盘' },
    ],
  },
  {
    title: '📱 号卡办理',
    links: [
      { name: '电信星卡', url: 'https://ym.ksjhaoka.com/?s=loshqy1H719207', desc: '19-49元/月 四网可选' },
      { name: '172号卡', url: 'https://m.172.org.cn/ProductEn/Index/59bc0abc9a7d31f5', desc: '全国配送' },
      { name: '好卡新耀', url: 'https://www.haokaxinyao.com/', desc: '四网套餐' },
      { name: '咔咔通信', url: 'https://haoka.kakatx.com/', desc: '正规授权' },
      { name: '蛋蛋号卡', url: 'https://ka.dandanhou.net/', desc: '新上线' },
      { name: '灵渠号卡', url: 'https://lingqu.87haoka.cn/s/Cf3HUSBk', desc: '四网套餐' },
      { name: '青禾号卡', url: 'https://www.hemorn.cn/index?k=Vm5qREtSUUFyMTA9', desc: '四网套餐' },
    ],
  },
  {
    title: '📶 随身WiFi',
    links: [
      { name: '飞利猫随身WiFi', url: 'https://h5.feilimao.cn/#/index/9cd45bdffaa18d79/1', desc: '39元/月起' },
      { name: '格行随身WiFi', url: 'http://2.0.gexing.cn/m/shopList?userId=27519', desc: '59元/月起' },
      { name: '超能犇充电宝WiFi', url: 'https://h5.lianhengkj.com/#/pages/agentMoudle/goods/goods-info?a=744a27823582798b6deb22acf781964f4e73c1e346a28065', desc: '充电宝+WiFi二合一' },
      { name: '超能犇CPE宽带', url: 'https://h5.lianhengkj.com/#/pages/agentMoudle/goods/goods-info?a=28753d869f12c9556deb22acf781964f4e73c1e346a28065', desc: '免插卡穿墙王' },
      { name: '超能犇5G-CPE', url: 'https://h5.lianhengkj.com/#/pages/agentMoudle/goods/goods-info?a=b93d26e277c676676deb22acf781964f4e73c1e346a28065', desc: '5G高速' },
      { name: '联通单网WiFi', url: 'https://h5.dandanhou.net/order/index.php?uid=N0JpQm5nd0ZzazQ9&pid=1348', desc: '39元/月3000G' },
    ],
  },
  {
    title: '☁️ 云服务',
    links: [
      { name: '腾讯云国内站', url: 'https://curl.qcloud.com/ITnFdvQ9', desc: '服务器优惠' },
      { name: '腾讯云国外站', url: 'https://curl.qcloud.com/Kholy9gT', desc: '海外服务器' },
      { name: '阿里云新客户', url: 'https://www.aliyun.com/minisite/goods?userCode=9iwd9zzb', desc: '新用户专享' },
    ],
  },
]
</script>

<style scoped>
.friend-links-wrapper {
  max-width: 1000px;
  margin: 40px auto 0;
  padding: 0 20px;
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.fl-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--primary, #6366f1);
}

.fl-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text, #1e293b);
  margin: 0;
}

.fl-header p {
  font-size: 13px;
  color: var(--muted, #64748b);
  margin: 6px 0 0;
}

.fl-grid-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.fl-section {
  background: var(--card-bg, #f8fafc);
  border: 1px solid var(--border, #e2e8f0);
  border-left: 3px solid var(--primary, #6366f1);
  border-radius: 8px;
  padding: 16px;
}

.fl-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text, #1e293b);
  display: flex;
  align-items: center;
  gap: 6px;
}

.fl-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
}

.fl-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border, #e2e8f0);
  text-align: center;
}

.fl-link:hover {
  background: var(--primary-light, #eef2ff);
  border-color: var(--primary, #6366f1);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
}

.fl-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text, #1e293b);
}

.fl-link:hover .fl-name {
  color: var(--primary, #6366f1);
}

.fl-desc {
  font-size: 11px;
  color: var(--muted, #64748b);
  margin-top: 2px;
}

.fl-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border, #e2e8f0);
  font-size: 12px;
  color: var(--muted, #94a3b8);
}

@media (max-width: 768px) {
  .friend-links-wrapper {
    padding: 0 16px;
  }

  .fl-list {
    grid-template-columns: 1fr;
  }
}

:global([data-theme="dark"]) .friend-links-wrapper {
  --card-bg: #1e293b;
  --border: #334155;
  --text: #f1f5f9;
  --muted: #94a3b8;
  --primary-light: #312e81;
}

:global([data-theme="dark"]) .friend-links-wrapper {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}
</style>

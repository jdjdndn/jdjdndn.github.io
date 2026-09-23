// 副业页面数据配置
import { wifiProxyLinks } from '../wifi-data.js'

export const fuyePages = {
  'fuye/haoka': {
    icon: '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>',
    title: '号卡代理',
    subtitle: '零成本副业 · 月入过万攻略 · 四网套餐全国配送',
    statNum: '7',
    statLabel: '篇攻略',
    intro: '号卡代理是指代理销售各大运营商（移动、联通、电信、广电）的手机卡/流量卡。每成功办理一张卡，即可获得几十到上百元佣金。零成本起步，无需囤货，适合有社交资源的人作为副业。',
    banner: { icon: '📱', name: '自用省钱？办理流量卡', desc: '低月租大流量 · 四网可选 · 正规授权', url: '/haoka.html' },
    entries: [
      { id: 1, icon: '💰', name: '号卡代理', desc: '办卡赚佣金，零成本副业', url: '/haoka-agent.html' }
    ],
    guides: [
      { id: 1, title: '如何成为号卡代理', desc: '3步开启你的副业之路', url: '/haoka-agent.html' },
      { id: 2, title: '佣金规则详解', desc: '不同套餐佣金比例说明', url: '/haoka-agent.html' },
      { id: 3, title: '推广方法分享', desc: '朋友圈/社群/短视频推广技巧', url: '/haoka-agent.html' },
      { id: 4, title: '提现流程说明', desc: '佣金提现步骤和到账时间', url: '/haoka-agent.html' },
      { id: 5, title: '常见问题解答', desc: '代理常见问题汇总', url: '/haoka-agent.html' }
    ],
    meta: {
      title: '号卡代理 — 副业入口 | 券宝',
      description: '零成本号卡代理副业：办理流量卡赚佣金，四网套餐全国配送，月入过万攻略。',
      keywords: '号卡代理,流量卡,副业,赚钱,佣金'
    }
  },

  'fuye/haoka-agent': {
    icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    title: '号卡代理招募',
    subtitle: '高佣推广 · 一件代发 · 专业培训 · 持续售后',
    statNum: '40%',
    statLabel: '佣金比例',
    intro: '号卡代理招募计划：零成本加入，享受高佣金推广。平台提供一件代发、专业培训、持续售后支持，助你快速开启副业之路。',
    entries: [
      { id: 1, icon: '📋', name: '代理申请', desc: '立即申请成为代理', url: '' },
      { id: 2, icon: '📊', name: '佣金说明', desc: '了解佣金规则和提现流程', url: '' },
      { id: 3, icon: '🎓', name: '培训资料', desc: '代理培训视频和文档', url: '' }
    ],
    guides: [
      { id: 1, title: '代理申请流程', desc: '如何快速成为号卡代理', url: '' },
      { id: 2, title: '佣金计算规则', desc: '不同套餐的佣金比例', url: '' },
      { id: 3, title: '推广技巧分享', desc: '高效推广方法和话术', url: '' },
      { id: 4, title: '常见问题解答', desc: '代理常见问题汇总', url: '' }
    ],
    meta: {
      title: '号卡代理招募 — 高佣推广 · 零成本加入 | 券宝',
      description: '号卡代理招募：高佣推广、一件代发、专业培训、持续售后。',
      keywords: '号卡代理,流量卡代理,副业,高佣推广'
    }
  },

  'fuye/dianshang': {
    icon: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    title: '电商带货',
    subtitle: '京东/淘宝/拼多多/携程优惠推广 · 赚取佣金',
    statNum: '5+',
    statLabel: '平台',
    intro: '电商带货是指通过推广京东、淘宝、拼多多、携程等电商平台的商品或优惠券，用户通过你的链接购买后你获得佣金。适合有社交资源、愿意分享好物的人，可以是微信群、朋友圈、社群等渠道推广。',
    entries: [
      { id: 1, icon: '🛒', name: '网购聚合平台', desc: '京东/淘宝/拼多多优惠券', url: 'https://kjndsaf2.kzurl01.cn/28/87/p69305960721c8b?keycode=92a874ddcd4466e76127d3589016a29b&is_new=1' },
    ],
    guides: [
      { id: 1, title: '网购聚合平台入口', desc: '一站式查找全网最低价', url: '/gouwu.html' },
      { id: 2, title: '京东优惠券攻略', desc: '京东内部优惠券推广方法', url: '/article/jd-coupon-guide.html' },
      { id: 3, title: '携程/飞猪优惠', desc: '旅行平台优惠推广', url: '/article/fliggy-discount.html' },
      { id: 4, title: '滴滴出行优惠', desc: '打车券推广赚佣金', url: '/article/didi-coupon-guide.html' }
    ],
    meta: {
      title: '电商带货 — 副业入口 | 券宝',
      description: '电商带货副业：京东/淘宝/拼多多/携程优惠推广，赚取佣金。',
      keywords: '电商带货,京东推广,淘宝推广,拼多多推广,副业,赚钱'
    }
  },

  'fuye/huishou': {
    icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    title: '上门回收',
    subtitle: '回收旧衣服、旧手机、家电 · 赚取差价或佣金',
    statNum: '环保',
    statLabel: '副业',
    intro: '上门回收是指通过平台接单，上门回收用户的旧衣服、旧手机、旧家电等物品。平台提供回收渠道和定价，你负责上门取件，赚取差价或佣金。适合时间灵活、愿意跑动的人。',
    entries: [
      { id: 1, icon: '👕', name: '旧衣服回收', desc: '上门回收旧衣物赚佣金', url: 'weixin://dl/business/?appid=wx3f0209cc35a953a4&path=wjyk_recycle/pages/index/index&query=scene%3D23542300' },
    ],
    guides: [
      { id: 1, title: '上门回收完整攻略', desc: '平台注册、接单流程、收益计算', url: '/article/taobao-eleme-earn.html' },
      { id: 2, title: '旧手机回收指南', desc: '手机估价、回收渠道、注意事项', url: '/article/taobao-eleme-community.html' },
      { id: 3, title: '快递上门取件', desc: '成为快递取件员的方法', url: '/article/express-guide.html' }
    ],
    meta: {
      title: '上门回收 — 副业入口 | 券宝',
      description: '上门回收副业：回收旧衣服、旧手机、家电，赚取差价或佣金。',
      keywords: '上门回收,旧衣服回收,旧手机回收,副业,赚钱'
    }
  },

  'fuye/huiyuan': {
    icon: '<path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>',
    title: '会员分销',
    subtitle: '影视/音乐会员推广赚佣金 · 零成本高回报',
    statNum: '高',
    statLabel: '佣金比例',
    intro: '会员分销是指推广各大平台（爱奇艺、腾讯视频、网易云音乐等）的VIP会员，用户通过你的链接购买后你获得佣金。单价高、复购率高，适合有社交资源的人作为副业。',
    entries: [
      { id: 1, icon: '🎬', name: '各大平台影视VIP会员优惠办理', desc: '爱奇艺/腾讯/优酷会员推广', url: 'https://wcbblll.99kami.com' },
      { id: 2, icon: '🎵', name: '各大平台影视VIP会员优惠办理', desc: '网易云/QQ音乐会员推广', url: 'https://wcbblll.im01.cn' },
      { id: 3, icon: '⛽', name: '粉丝关注服务', desc: '话费充值/流量包推广', url: 'http://35568.qcxmt.cn' }
    ],
    guides: [
      // { id: 1, title: '会员分销完整攻略', desc: '平台选择、推广方法、佣金结算', url: '/article/huiyuan-guide.html' },
      // { id: 2, title: '立即开始分销', desc: '注册并获取你的专属推广链接', url: 'https://wcbblll.99kami.com' },
      // { id: 3, title: '360 AI大会员推广', desc: '高佣金AI会员产品', url: '/article/360ai大会员.html' }
    ],
    meta: {
      title: '会员分销 — 副业入口 | 券宝',
      description: '会员分销副业：影视/音乐会员推广赚佣金，零成本高回报。',
      keywords: '会员分销,影视会员,音乐会员,副业,赚钱'
    }
  },

  'fuye/laxin': {
    icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    title: 'App拉新',
    subtitle: '帮APP推广拉新用户 · 赚取推广佣金',
    statNum: '多',
    statLabel: '平台可选',
    intro: 'App拉新是指帮各大APP（如淘宝、京东、美团、抖音等）推广拉新用户。每成功邀请一个新用户注册并完成首单，即可获得几元到几十元不等的佣金。适合有社交资源、愿意分享的人。',
    entries: [
      { id: 1, icon: '🛒', name: 'App拉新拉新', desc: '淘宝APP推广赚佣金', url: 'https://docs.qq.com/doc/DTnVHV1RuVHZWVVRC?nlc=1' },
    ],
    guides: [
      { id: 1, title: 'App拉新完整攻略', desc: '平台选择、推广技巧、佣金结算', url: '/article/taobao-eleme-community.html' },
      { id: 2, title: '淘宝饿了么拉新', desc: '淘宝系APP推广方法', url: '/article/taobao-eleme-community.html' },
      { id: 3, title: '京东拉新教程', desc: '京东APP推广技巧', url: '/article/taobao-eleme-community.html' }
    ],
    meta: {
      title: 'App拉新 — 副业入口 | 券宝',
      description: 'App拉新副业：帮APP推广拉新用户，赚取推广佣金。',
      keywords: 'App拉新,APP推广,拉新赚钱,副业,赚钱'
    }
  },

  'fuye/wifi-agent': {
    icon: '<path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
    title: '随身WiFi代理',
    subtitle: '便携WiFi设备代理 · 高佣推广 · 一件代发',
    statNum: '3',
    statLabel: '大品牌',
    intro: '随身WiFi代理是指代理销售便携WiFi设备（如飞利猫、格行、超能犇等）。每成功推荐一台设备，即可获得佣金。设备便携小巧，适合出差旅行、家庭备用、学生宿舍等场景。零成本起步，无需囤货。',
    entries: wifiProxyLinks.map((proxy, i) => ({
      id: i + 1,
      icon: '📶',
      name: proxy.name,
      desc: '立即注册成为代理',
      url: proxy.url
    })),
    guides: [
      { id: 1, title: '随身WiFi代理入门', desc: '了解随身WiFi代理模式和收益', url: '' },
      { id: 2, title: '代理注册流程', desc: '如何快速成为随身WiFi代理', url: '' },
      { id: 3, title: '推广技巧分享', desc: '高效推广随身WiFi的方法', url: '' },
      { id: 4, title: '常见问题解答', desc: '代理常见问题汇总', url: '' }
    ],
    meta: {
      title: '随身WiFi代理 — 便携WiFi设备代理 · 高佣推广 | 券宝',
      description: '随身WiFi代理招募：代理销售便携WiFi设备，高佣金、一件代发、零成本起步。',
      keywords: '随身WiFi代理,便携WiFi,代理推广,副业,赚钱'
    }
  }
}

// 获取页面配置
export function getFuyePageConfig(slug) {
  return fuyePages[slug] || null
}

// 获取所有副业页面路径
export function getAllFuyePaths() {
  return Object.keys(fuyePages)
}

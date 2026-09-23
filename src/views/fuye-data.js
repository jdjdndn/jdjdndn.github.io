// 副业页面数据配置
import { wifiProxyLinks } from '../templates/wifi-data.js'

export const fuyePages = {
  'fuye/haoka': {
    icon: '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>',
    title: '号卡代理',
    subtitle: '号卡业务现状 · 合规路径与防骗',
    statNum: '5',
    statLabel: '篇指南',
    intro: '2026年8月1日起，三大运营商全面停止第三方互联网渠道号卡办理，线上号卡代理模式已终结。本页梳理号卡业务真实现状、线下授权合规路径与假代理骗局识别，帮你认清行业情况。',
    banner: { icon: '📱', name: '号卡办理渠道', desc: '官方渠道办理 · 线下授权合规路径', url: '/haoka.html' },
    entries: [
      { id: 1, icon: '📋', name: '号卡业务现状', desc: '新规后现状与合规路径指南', url: '/article/haoka-agent-guide.html' }
    ],
    guides: [
      { id: 1, title: '号卡代理现状与合规路径', desc: '2026新规后还有哪些路', url: '/article/haoka-agent-guide.html', steps: ['了解2026年8月1日新规：第三方互联网渠道号卡办理全面停止', '想办卡走运营商官方App/官网或线下营业厅', '想入行只剩线下授权渠道（需资质），谨防假代理骗局'] },
      { id: 2, title: '佣金现状与结算', desc: '线上佣金模式已停，看清现状', url: '/article/haoka-commission.html', steps: ['线上代理分佣体系已随新规关闭', '线下授权渠道按运营商合同结算', '警惕「高佣代理」「缴保证金提现」骗局'] },
      { id: 3, title: '推广合规方法', desc: '哪些推广已禁止，合规边界在哪', url: '/article/haoka-promote.html', steps: ['禁止公域宣传：短视频/直播/电商/闲鱼/公域发帖全停', '禁止私域分销与二维码裂变', '合规路径只有官方渠道与线下授权场景'] },
      { id: 4, title: '结算与提现', desc: '结算路径与提现骗局识别', url: '/article/haoka-withdraw.html', steps: ['线上提现体系已关闭，以平台公告为准', '线下授权渠道按合同结算', '识别「缴保证金才能提现」等二次诈骗'] },
      { id: 5, title: '常见问题解答', desc: '办卡/代理/防骗高频问答', url: '/article/haoka-faq.html', steps: ['办卡只能走官方App/官网或线下营业厅', '线上代理招募基本是违规或骗局', '已办卡不受影响，实名制要求不变'] }
    ],
    meta: {
      title: '号卡业务现状 — 副业入口 | 券宝',
      description: '2026号卡新规后现状梳理：官方渠道办理、线下授权合规路径、假代理骗局识别。',
      keywords: '号卡,号卡新规,流量卡,办卡渠道,副业'
    }
  },

  'fuye/haoka-agent': {
    icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    title: '号卡业务指南',
    subtitle: '现状梳理 · 合规路径 · 防骗指南',
    statNum: '新规',
    statLabel: '2026.8.1',
    intro: '2026年8月1日三大运营商新规后，线上号卡代理已全面停止。本页是号卡业务最真实的现状：正规办卡渠道、线下授权路径，以及必须避开的代理骗局。',
    entries: [
      { id: 1, icon: '📋', name: '号卡业务现状', desc: '新规后现状与合规路径', url: '/article/haoka-agent-guide.html' },
      { id: 2, icon: '🛡️', name: '防骗指南', desc: '识别假代理与提现骗局', url: '/article/haoka-faq.html' }
    ],
    guides: [
      { id: 1, title: '号卡代理现状与合规路径', desc: '2026新规后还有哪些路', url: '/article/haoka-agent-guide.html', steps: ['了解2026年8月1日新规：第三方互联网渠道号卡办理全面停止', '想办卡走运营商官方App/官网或线下营业厅', '想入行只剩线下授权渠道（需资质），谨防假代理骗局'] },
      { id: 2, title: '佣金现状与结算', desc: '线上佣金模式已停，看清现状', url: '/article/haoka-commission.html', steps: ['线上代理分佣体系已随新规关闭', '线下授权渠道按运营商合同结算', '警惕「高佣代理」「缴保证金提现」骗局'] },
      { id: 3, title: '推广合规方法', desc: '哪些推广已禁止，合规边界在哪', url: '/article/haoka-promote.html', steps: ['禁止公域宣传：短视频/直播/电商/闲鱼/公域发帖全停', '禁止私域分销与二维码裂变', '合规路径只有官方渠道与线下授权场景'] },
      { id: 4, title: '结算与提现', desc: '结算路径与提现骗局识别', url: '/article/haoka-withdraw.html', steps: ['线上提现体系已关闭，以平台公告为准', '线下授权渠道按合同结算', '识别「缴保证金才能提现」等二次诈骗'] },
      { id: 5, title: '常见问题解答', desc: '办卡/代理/防骗高频问答', url: '/article/haoka-faq.html', steps: ['办卡只能走官方App/官网或线下营业厅', '线上代理招募基本是违规或骗局', '已办卡不受影响，实名制要求不变'] }
    ],
    meta: {
      title: '号卡业务指南 — 现状与合规 | 券宝',
      description: '2026号卡新规后现状梳理：官方渠道办理、线下授权合规路径、假代理骗局识别。',
      keywords: '号卡,号卡新规,流量卡,办卡渠道,副业'
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
      {
        id: 1, title: '网购聚合平台入口', desc: '一站式查找全网最低价，推广赚佣金',
        url: '/article/gouwu-platform-guide.html',
        steps: ['打开聚合平台，搜索想推广的商品（如「连衣裙」「手机壳」）', '一键对比京东/淘宝/拼多多全网最低价，选择佣金最高的平台', '复制商品专属推广链接（含你的推广ID）', '发到微信群/朋友圈，有人下单你就能赚佣金']
      },
      {
        id: 2, title: '京东优惠券攻略', desc: '京东内部优惠券推广方法（京东联盟实操）',
        url: '/article/jd-coupon-guide.html',
        steps: ['注册京东联盟账号（union.jd.com）并完成实名认证', '在「我要推广」选择商品，生成专属推广链接或口令', '把链接发到社群、朋友圈、闲鱼，引导用户下单', '订单确认收货后佣金到账，每月25号可提现']
      },
      {
        id: 3, title: '携程/飞猪优惠', desc: '旅行平台优惠推广（酒店/机票佣金）',
        url: '/article/fliggy-discount.html',
        steps: ['注册阿里妈妈淘客账号（alimama.com），开通飞猪推广权限', '在「旅行推广」挑选酒店/机票活动生成推广链接', '发到出行群/小红书/朋友圈，文案「暑假出游订酒店省30%」', '用户预订成交后，佣金在订单确认后结算']
      },
      {
        id: 4, title: '滴滴出行优惠', desc: '打车券推广赚佣金（打车刚需高转化）',
        url: '/article/didi-coupon-guide.html',
        steps: ['申请滴滴出行推广计划（通过第三方CPS平台）', '获取打车券专属推广链接（如「领18元打车券」）', '分享到朋友圈/社群（打车券人人可用，转化率高）', '别人领券打车后，你赚2-5元推广佣金']
      }
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
      { id: 1, title: '上门回收完整攻略', desc: '平台注册、接单流程、收益计算', url: '/article/taobao-eleme-earn.html', steps: ['下载回收平台APP（如白鲸鱼、飞蚂蚁），注册成为回收员', '完善个人信息和上门区域，等待系统派单或主动抢单', '联系用户确认上门时间，上门取件并验收', '物品交接后佣金到账，一般T+1结算'] },
      { id: 2, title: '旧手机回收指南', desc: '手机估价、回收渠道、注意事项', url: '/article/taobao-eleme-community.html', steps: ['在估价平台（如转转、爱回收）输入手机型号和成色', '获取预估回收价格，对比多个平台选择最高价', '引导用户下单，预约上门取件或邮寄', '手机验收通过后佣金到账'] },
      { id: 3, title: '快递上门取件', desc: '成为快递取件员的方法', url: '/article/express-guide.html', steps: ['联系当地快递网点（顺丰、京东、中通等），询问是否招兼职取件员', '下载快递员APP，注册并绑定银行卡', '在指定区域接单，上门取件并寄出', '按单结算佣金，多劳多得'] }
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
    subtitle: '影视/音乐会员推广赚佣金 · 收益以实际为准',
    statNum: '高',
    statLabel: '佣金比例',
    intro: '会员分销是指推广各大平台（爱奇艺、腾讯视频、网易云音乐等）的VIP会员，用户通过你的链接购买后你获得佣金。单价高、复购率高，适合有社交资源的人作为副业。',
    entries: [
      { id: 1, icon: '🎬', name: '影视VIP会员优惠办理', desc: '爱奇艺/腾讯/优酷会员推广', url: 'https://wcbblll.99kami.com' },
      { id: 2, icon: '🎵', name: '音乐VIP会员优惠办理', desc: '网易云/QQ音乐会员推广', url: 'https://wcbblll.im01.cn' },
      { id: 3, icon: '⛽', name: '话费充值/流量包推广', desc: '粉丝关注服务', url: 'http://35568.qcxmt.cn' }
    ],
    guides: [
      { id: 1, title: '会员分销完整攻略', desc: '选品、推广、佣金结算全流程', url: '/article/huiyuan-guide.html', steps: ['进入99kami商城，注册成为分销员（填写手机号即可）', '在「影视会员」或「音乐会员」分类选择要推广的会员', '生成专属推广链接或海报，保存到手机', '发到朋友圈/社群，有人下单购买你就能赚佣金'] },
      { id: 2, title: '推广技巧与结算', desc: '选品策略、渠道打法、结算周期', url: '/article/huiyuan-promote.html', steps: ['跟热点选品：热播剧上线推对应平台会员（如《庆余年2》推腾讯视频）', '朋友圈+社群+闲鱼多渠道推广，文案「爱奇艺年卡99元，官网要198」', '订单支付后按平台周期结算（一般月结），在后台查看佣金明细'] },
      { id: 3, title: '常见问题解答', desc: '货源、交付、售后、合规答疑', url: '/article/huiyuan-faq.html', steps: ['货源：平台直接对接官方，会员充值有保障', '交付：用户下单后系统自动充值，无需手动操作', '售后：遇到充值问题联系平台客服处理'] }
    ],
    meta: {
      title: '会员分销 — 副业入口 | 券宝',
      description: '会员分销副业：影视/音乐会员推广赚佣金，收益以实际为准。',
      keywords: '会员分销,影视会员,音乐会员,副业,赚钱'
    }
  },

  'fuye/laxin': {
    icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    title: 'App拉新',
    subtitle: '帮APP推广拉新用户 · 赚取推广佣金',
    statNum: '多',
    statLabel: '平台可选',
    intro: 'App拉新是指帮各大APP（如百度网盘、夸克网盘、迅雷网盘、百度小说、知乎等）推广拉新用户。每成功邀请一个新用户注册并完成指定任务，即可获得几元到几十元不等的佣金。适合有社交资源、愿意分享的人。',
    entries: [
      { id: 1, icon: '📁', name: '百度/夸克/迅雷网盘拉新', desc: '网盘注册转存拉新', url: 'https://docs.qq.com/doc/DTnVHV1RuVHZWVVRC?nlc=1' },
      { id: 2, icon: '📖', name: '百度小说/知乎拉新', desc: '内容类App拉新', url: '/article/laxin-content.html' },
    ],
    guides: [
      { id: 1, title: 'App拉新完整攻略', desc: '网盘/小说/社区类平台通用流程', url: '/article/laxin-guide.html', steps: ['找官方推广渠道接单', '生成专属推广链接并自测', '发资源/内容引流，跟踪达标结算'] },
      { id: 2, title: '百度/夸克/迅雷网盘拉新', desc: '网盘注册转存拉新实操', url: '/article/laxin-netdisk.html', steps: ['申请网盘官方推广资格', '准备教程/模板等引流资源', '小红书/贴吧/社群发资源链接，转存即达标'] },
      { id: 3, title: '百度小说/知乎拉新', desc: '内容类App拉新实操', url: '/article/laxin-content.html', steps: ['申请内容平台推广资格', '发书单/干货内容种草引流', '用户下载注册完成阅读动作即达标'] }
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
    subtitle: '便携WiFi设备代理 · 收益以实际为准',
    statNum: '3',
    statLabel: '大品牌',
    intro: '随身WiFi代理是指代理销售便携WiFi设备（如飞利猫、格行、超能犇等）。每成功推荐一台设备，可获得佣金，具体收益以平台代理政策为准。设备便携小巧，适合出差旅行、家庭备用、学生宿舍等场景。',
    entries: wifiProxyLinks.map((proxy, i) => ({
      id: i + 1,
      icon: '📶',
      name: proxy.name,
      desc: '立即注册成为代理',
      url: proxy.url
    })),
    guides: [
      { id: 1, title: '随身WiFi代理入门', desc: '了解随身WiFi代理模式和收益', url: '/article/wifi-agent-guide.html', steps: ['了解收益来源：设备销售利润 + 流量续费分成，具体以平台代理政策为准', '确认适合你的推广资源：租房群、学生群、出差人群', '按平台代理政策注册，发货与售后由平台负责'] },
      { id: 2, title: '代理注册流程', desc: '如何快速成为随身WiFi代理', url: '/article/wifi-agent-register.html', steps: ['找到品牌代理申请入口（如飞利猫、格行官网），点击「成为代理」', '填写手机号、微信号等信息提交申请，等待审核（1-3天）', '审核通过后登录代理后台，熟悉后台功能并领取推广物料'] },
      { id: 3, title: '推广技巧分享', desc: '高效推广随身WiFi的方法', url: '/article/wifi-agent-promote.html', steps: ['锁定目标人群：租房族（没宽带）、学生（宿舍用）、出差族（酒店WiFi慢）', '朋友圈+社群+闲鱼多渠道推广，文案「随身WiFi，月租19元不限流量」', '老用户转介绍裂变：推荐朋友购买返现10-20元'] },
      { id: 4, title: '常见问题解答', desc: '代理常见问题汇总', url: '/article/wifi-agent-faq.html', steps: ['设备类：发货与售后由平台负责，以平台政策为准', '流量类：用户后续充值流量，你持续有分成', '收益类：设备利润+流量分成，具体以平台实际结算为准'] }
    ],
    meta: {
      title: '随身WiFi代理 — 便携WiFi设备代理 | 券宝',
      description: '随身WiFi代理：代理销售便携WiFi设备，收益以平台实际展示为准。',
      keywords: '随身WiFi代理,便携WiFi,代理推广,副业'
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

// ============================================================
//  号卡专区数据
//  从 data.js 的 friendLinks 中提取 category === '号卡办理' 的条目
//  修改此文件即可更新号卡专区页面内容
//
//  数据结构说明：
//  haokaLinks: 号卡链接数组
//    必填: name / url
//    可选: description / priceRange / nationwide / badge
//    priceRange: 价格区间文字（如 "19-49元/月"）
//    nationwide: 是否全国配送（默认 false）
//    badge: 徽章文字（如 "热门"、"新品"、"四网"），不填则不显示
// ============================================================

export const haokaLinks = [
  {
    name: '电信星卡',
    url: 'https://ym.ksjhaoka.com/?s=loshqy1H719207',
    description: '高性价比号卡平台，四网套餐可选，适合追求低价大流量的用户',
    priceRange: '19-49元/月',
    nationwide: false,
    badge: '四网',
  },
  {
    name: '172号卡',
    url: 'https://m.172.org.cn/ProductEn/Index/59bc0abc9a7d31f5',
    description: '172号卡官方商城，四网号卡办理，套餐丰富，安全可靠',
    priceRange: '19-59元/月',
    nationwide: true,
    badge: '热门',
  },
  {
    name: '好卡新耀',
    url: 'https://www.haokaxinyao.com/#/pages/sales_index/my_store?mall_id=A3uqdWKQRcA9Gpw0Ae2M5Q%3D%3D',
    description: '好卡新耀号卡平台，四网套餐可选，多种流量组合灵活搭配',
    priceRange: '19-49元/月',
    nationwide: false,
    badge: '四网',
  },
  {
    name: '咔咔通信',
    url: 'https://haoka.kakatx.com/web/#/pages/index/nationwide?token=MjY2NzIxfDE3ODk0NzE0OTcxMzdoYW9rYTY2Ng&viewRole=user',
    description: '全国号卡办理中心，四网套餐齐全，运营商正规授权',
    priceRange: '29-69元/月',
    nationwide: true,
    badge: '四网',
  },
  {
    name: '蛋蛋号卡',
    url: 'https://ka.dandanhou.net/index?k=N0JpQm5nd0ZzazQ9',
    description: '号卡办理平台，四网套餐可选，新上线高性价比渠道',
    priceRange: '19-49元/月',
    nationwide: false,
    badge: '新品',
  },
  {
    name: '灵渠号卡',
    url: 'https://lingqu.87haoka.cn/s/Cf3HUSBk',
    description: '号卡办理平台，四网套餐可选，新上线高性价比渠道',
    priceRange: '19-49元/月',
    nationwide: false,
    badge: '四网',
  },
  {
    name: '青禾号卡',
    url: 'https://www.hemorn.cn/index?k=Vm5qREtSUUFyMTA9',
    description: '号卡办理平台，四网套餐可选，新上线高性价比渠道',
    priceRange: '19-49元/月',
    nationwide: false,
    badge: '四网',
  },
];

// ========== 代理注册链接 ==========
// 每个号卡对应的代理注册入口，name 须与 haokaLinks 中的 name 一一对应

export const haokaProxyLinks = [
  {name: '电信星卡代理', url: 'https://ksjhaoka.com/invite?s=loshqy1H719207'},
  {name: '172号卡代理', url: 'https://haoka.lot-ml.com/plugreg.html?agentid=1923771'},
  {name: '好卡新耀代理', url: 'https://s.haokavip.com/u/4714419'},
  {name: '咔咔通信代理', url: 'https://haoka.kakatx.com/register?inviteCode=KBOMJG1T'},
  {name: '蛋蛋号卡代理', url: 'https://ka.dandanhou.net/agent/reg.php?code=TA2O2ZZ4'},
  {name: '灵渠号卡代理', url: 'https://lingqu.87haoka.cn/r/06844666'},
  {name: '青禾号卡代理', url: 'https://www.hemorn.cn/api/register?code=4XZ619ZX'},
]

import { createRouter, createWebHistory } from 'vue-router'

// 路由配置 - 保持与现有 URL 结构兼容
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '券宝 — 优惠券聚合平台',
      description: '券宝优惠券聚合平台，汇聚全网热门优惠券，一站式省钱利器。',
      keywords: '券宝,优惠券,优惠聚合,省钱'
    }
  },
  {
    path: '/haoka.html',
    name: 'Haoka',
    component: () => import('../views/Haoka.vue'),
    meta: {
      title: '号卡办理专区 — 流量卡 · 正规运营商授权',
      description: '号卡办理专区，聚合多平台优惠号卡：四网套餐、大流量、低月租、正规运营商授权。',
      keywords: '号卡办理,流量卡,大流量套餐,低月租,手机卡'
    }
  },
  {
    path: '/haoka-agent.html',
    name: 'HaokaAgent',
    component: () => import('../views/HaokaAgent.vue'),
    meta: {
      title: '号卡代理合伙人招募 — 高佣推广 · 零成本加入',
      description: '号卡代理合伙人招募：高佣推广、一件代发、专业培训、持续售后。',
      keywords: '号卡代理,流量卡代理,副业,高佣推广'
    }
  },
  {
    path: '/huodong.html',
    name: 'Huodong',
    component: () => import('../views/Huodong.vue'),
    meta: {
      title: '优惠活动聚合 — 全网热门优惠',
      description: '优惠活动聚合，汇集全网热门优惠活动，省钱利器。',
      keywords: '优惠活动,省钱,优惠券'
    }
  },
  {
    path: '/huiyuan.html',
    name: 'Huiyuan',
    component: () => import('../views/Huiyuan.vue'),
    meta: {
      title: '会员优惠专区 — VIP会员优惠',
      description: '会员优惠专区，汇集各大平台VIP会员优惠。',
      keywords: '会员优惠,VIP,会员卡'
    }
  },
  {
    path: '/wangpan.html',
    name: 'Wangpan',
    component: () => import('../views/Wangpan.vue'),
    meta: {
      title: '网盘资源 — 免费网盘推荐',
      description: '网盘资源聚合，免费网盘推荐，大容量存储。',
      keywords: '网盘,云盘,免费网盘'
    }
  },
  {
    path: '/wifi.html',
    name: 'Wifi',
    component: () => import('../views/Wifi.vue'),
    meta: {
      title: '随身WiFi专区 — 便携WiFi设备',
      description: '随身WiFi专区，便携WiFi设备推荐，随时随地上网。',
      keywords: '随身WiFi,便携WiFi,移动WiFi'
    }
  },
  {
    path: '/about.html',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: '关于我们 — 券宝平台介绍',
      description: '关于我们，券宝平台介绍，优惠券聚合平台。',
      keywords: '关于我们,平台介绍,券宝'
    }
  },
  {
    path: '/fuye.html',
    name: 'Fuye',
    component: () => import('../views/Fuye.vue'),
    meta: {
      title: '副业赚钱 — 网络副业项目',
      description: '副业赚钱，网络副业项目推荐，轻松赚取额外收入。',
      keywords: '副业,赚钱,网络副业'
    }
  },
  {
    path: '/gouwu.html',
    name: 'Gouwu',
    component: () => import('../views/Gouwu.vue'),
    meta: {
      title: '购物优惠 — 电商平台优惠',
      description: '购物优惠，电商平台优惠汇总，省钱购物。',
      keywords: '购物优惠,电商优惠,省钱购物'
    }
  },
  {
    path: '/privacy.html',
    name: 'Privacy',
    component: () => import('../views/Privacy.vue'),
    meta: {
      title: '隐私政策 — 券宝隐私说明',
      description: '隐私政策，券宝隐私说明，保护用户隐私。',
      keywords: '隐私政策,隐私说明,用户隐私'
    }
  },
  {
    path: '/qunliao.html',
    name: 'Qunliao',
    component: () => import('../views/Qunliao.vue'),
    meta: {
      title: '群聊优惠 — 社群优惠分享',
      description: '群聊优惠，社群优惠分享，优惠信息交流。',
      keywords: '群聊优惠,社群优惠,优惠分享'
    }
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫 - 更新 SEO meta
router.beforeEach((to, from, next) => {
  // 更新页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 更新 meta description
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description)
    }
  }

  // 更新 meta keywords
  if (to.meta.keywords) {
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', to.meta.keywords)
    }
  }

  next()
})

export default router

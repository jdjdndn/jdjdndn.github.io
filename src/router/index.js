import { createRouter, createWebHistory } from 'vue-router'
import { getFuyePageConfig, getAllFuyePaths } from '../views/fuye-data'

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
    path: '/haoka-hero.html',
    name: 'HaokaHero',
    component: () => import('../views/haoka/HaokaHero.vue'),
    meta: {
      title: '号卡选卡指南 — 选卡攻略 · 运营商对比 · FAQ',
      description: '号卡选卡指南：如何选对号卡、四大运营商对比、常见问题解答，帮你找到最合适的流量卡。',
      keywords: '号卡选卡,流量卡指南,运营商对比,号卡FAQ'
    }
  },
  {
    path: '/haoka-agent.html',
    name: 'HaokaAgent',
    component: () => import('../views/haoka/HaokaAgent.vue'),
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
    path: '/waimai.html',
    name: 'Waimai',
    component: () => import('../views/Waimai.vue'),
    meta: {
      title: '外卖优惠 — 美团外卖红包',
      description: '美团外卖天天领红包，新客立减，吃喝玩乐福利。',
      keywords: '外卖优惠,美团外卖,外卖红包'
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
  },

  // 副业二级页面
  {
    path: '/fuye/:slug.html',
    name: 'FuyePage',
    component: () => import('../views/FuyePage.vue'),
    props: route => {
      const slug = route.params.slug
      const config = getFuyePageConfig(`fuye/${slug}`)
      return { config }
    },
    beforeEnter: (to, from, next) => {
      const slug = to.params.slug
      const config = getFuyePageConfig(`fuye/${slug}`)
      if (!config) {
        next('/fuye.html')
        return
      }
      // 更新 meta 信息
      to.meta = {
        ...to.meta,
        ...config.meta
      }
      next()
    }
  },

  // 兜底路由：未知路径不匹配任何路由（由拦截器处理 404）
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面未找到 — 券宝',
      description: '您访问的页面不存在或已被移除。',
      robots: 'noindex, follow'
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

// 通用路由拦截器
router.beforeEach((to, from, next) => {
  // 1. 处理 /article/ 目录下的路由 - 重定向到静态 HTML 文件
  if (to.path.startsWith('/article/')) {
    const articlePath = to.path.replace('/article/', '')
    // 使用绝对路径避免相对路径计算错误导致无限循环
    const baseUrl = import.meta.env.BASE_URL || '/'
    // 确保baseUrl以/结尾，避免双重斜杠
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
    const articleUrl = `${normalizedBase}article/${articlePath}`
    window.location.href = articleUrl
    return
  }

  // 2. 更新 SEO meta
  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description)
    }
  }

  if (to.meta.keywords) {
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', to.meta.keywords)
    }
  }

  if (to.meta.robots) {
    let robotsMeta = document.querySelector('meta[name="robots"]')
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta')
      robotsMeta.setAttribute('name', 'robots')
      document.head.appendChild(robotsMeta)
    }
    robotsMeta.setAttribute('content', to.meta.robots)
  }

  next()
})

export default router

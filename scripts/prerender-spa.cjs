// ============================================================
//  SPA 路由预渲染（SSG）
//  vite build 完成后启动 vite preview，用 Playwright 无头 Chromium
//  逐路由打开页面，把 Vue 运行时渲染后的 HTML 写回 dist/。
//
//  额外：首页 / 会从 src/data.js 读取全部 tabs 数据，把所有 tab 的
//  全部优惠链接注入一个 <div class="seo-prerender-full"> 区块，
//  保证爬虫不执行 JS 也能看到全部链接（不止默认第一个 tab）。
//
//  不修改任何 Vue 组件；用户访问时 Vue 仍会重新 mount，交互不受影响。
// ============================================================
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')
const { chromium } = require('playwright')

const ROOT = path.resolve(__dirname, '..')
const PORT = 4173
const BASE = `http://localhost:${PORT}`
const DIST = path.join(ROOT, 'dist')
const SITE_URL = 'https://jdjdndn.github.io'

// 需要预渲染的 SPA 路由（article/*.html 与 7 个着陆页已是静态 HTML，不在此列）
// 404.html 是 noindex fallback，不预渲染。
const ROUTES = [
  { url: '/', file: 'index.html', fullIndex: true },
  { url: '/haoka.html', file: 'haoka.html' },
  { url: '/creditcard.html', file: 'creditcard.html' },
  { url: '/haoka-hero.html', file: 'haoka-hero.html' },
  { url: '/haoka-agent.html', file: 'haoka-agent.html' },
  { url: '/huodong.html', file: 'huodong.html' },
  { url: '/waimai.html', file: 'waimai.html' },
  { url: '/huiyuan.html', file: 'huiyuan.html' },
  { url: '/wangpan.html', file: 'wangpan.html' },
  { url: '/wifi.html', file: 'wifi.html' },
  { url: '/about.html', file: 'about.html' },
  { url: '/fuye.html', file: 'fuye.html' },
  { url: '/gouwu.html', file: 'gouwu.html' },
  { url: '/privacy.html', file: 'privacy.html' },
  { url: '/qunliao.html', file: 'qunliao.html' },
  { url: '/fuye/dianshang.html', file: 'fuye/dianshang.html' },
  { url: '/fuye/haoka-agent.html', file: 'fuye/haoka-agent.html' },
  { url: '/fuye/haoka.html', file: 'fuye/haoka.html' },
  { url: '/fuye/huishou.html', file: 'fuye/huishou.html' },
  { url: '/fuye/huiyuan.html', file: 'fuye/huiyuan.html' },
  { url: '/fuye/kuaidi.html', file: 'fuye/kuaidi.html' },
  { url: '/fuye/laxin.html', file: 'fuye/laxin.html' },
  { url: '/fuye/wifi-agent.html', file: 'fuye/wifi-agent.html' },
  { url: '/fuye/xinyongka.html', file: 'fuye/xinyongka.html' },
]

function startServer() {
  const viteBin = path.join(ROOT, 'node_modules/vite/bin/vite.js')
  return spawn(process.execPath, [viteBin, 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: 'ignore',
    windowsHide: true,
  })
}

function waitForServer(timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const tick = () => {
      const req = require('http').get(`${BASE}/robots.txt`, (res) => {
        res.resume()
        resolve()
      })
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) reject(new Error('preview 启动超时'))
        else setTimeout(tick, 500)
      })
    }
    tick()
  })
}

// 从 src/data.js 读取全部 tabs，生成完整优惠列表 HTML（供爬虫读取）
async function buildFullIndexHtml() {
  const mod = await import(pathToFileURL(path.join(ROOT, 'src/data.js')).href)
  const tabs = mod.tabs || []
  let html = '<div class="seo-prerender-full" style="display:block" aria-hidden="false">'
  html += '<h2>全部优惠活动索引（构建期生成，供搜索引擎读取）</h2>'
  for (const tab of tabs) {
    html += `<section><h3>${tab.label || tab.name || ''}</h3>`
    for (const sec of tab.sections || []) {
      html += `<h4>${sec.title}</h4><ul>`
      for (const item of sec.items || []) {
        const deadline = item.deadline ? ` <small>（截止 ${item.deadline}）</small>` : ''
        if (item.link) {
          html += `<li><a href="${item.link}" target="_blank" rel="nofollow noopener">${item.name}</a>${deadline}</li>`
        } else {
          html += `<li><span>${item.name}</span>${deadline}</li>`
        }
      }
      html += '</ul>'
    }
    html += '</section>'
  }
  html += '</div>'
  return html
}

// 预渲染后 dist html 的 mtime 已变，重新生成 sitemap.xml 让 lastmod 准确
function regenerateSitemap() {
  const today = new Date().toISOString().slice(0, 10)
  const fileMtime = (p) => {
    try {
      return fs.statSync(p).mtime.toISOString().slice(0, 10)
    } catch {
      return today
    }
  }
  const url = (loc, lastmod, changefreq, priority) =>
    `\n  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`

  const LANDING = [
    'meituan-waimai',
    'meituan-jiuLv',
    'taobao-shangou',
    'jingdong-pdd',
    'chengxie',
    'didi',
    'liansuocanyin',
  ]
  const EXCLUDED = new Set(['404.html', 'common-page.html'])

  let out = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
  out += url(`${SITE_URL}/`, today, 'weekly', '1.0')
  out += url(`${SITE_URL}/llms.txt`, today, 'weekly', '0.6')
  out += url(`${SITE_URL}/llms-full.txt`, today, 'weekly', '0.5')

  // 根级 html 页面
  for (const f of fs.readdirSync(DIST)) {
    if (!f.endsWith('.html') || EXCLUDED.has(f)) continue
    const name = f.replace('.html', '')
    if (LANDING.includes(name)) continue
    out += url(`${SITE_URL}/${encodeURI(name)}.html`, fileMtime(path.join(DIST, f)), 'weekly', '0.8')
  }
  // 着陆页
  const landingLastmod = fileMtime(path.join(ROOT, 'src/templates/landing-pages.js'))
  for (const name of LANDING) {
    out += url(`${SITE_URL}/${name}.html`, landingLastmod, 'weekly', '0.7')
  }
  // article 递归
  const walk = (dir, prefix) => {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f)
      if (fs.statSync(full).isDirectory()) walk(full, prefix + f + '/')
      else if (f.endsWith('.html')) {
        const rel = prefix + f.replace('.html', '')
        out += url(`${SITE_URL}/article/${encodeURI(rel)}.html`, fileMtime(full), 'monthly', '0.6')
      }
    }
  }
  walk(path.join(DIST, 'article'), '')

  // fuye/ 子目录（项目代理页，index,follow）
  const fuyeDir = path.join(DIST, 'fuye')
  if (fs.existsSync(fuyeDir)) {
    for (const f of fs.readdirSync(fuyeDir)) {
      if (!f.endsWith('.html')) continue
      out += url(
        `${SITE_URL}/fuye/${encodeURI(f.replace('.html', ''))}.html`,
        fileMtime(path.join(fuyeDir, f)),
        'monthly',
        '0.5'
      )
    }
  }

  out += '\n</urlset>'
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), out, 'utf-8')
  return (out.match(/<loc>/g) || []).length
}

;(async () => {
  const server = startServer()
  const results = []
  let ok = true
  try {
    await waitForServer()
    const isCI = !!process.env.CI
    const browser = await chromium.launch({
      args: isCI ? ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] : [],
    })
    const page = await browser.newPage()
    // 预渲染只需 Vue 渲染的 HTML；拦截 iframe 外部导航请求，避免 networkidle 永不达到
    await page.route('**/*', (route) => {
      const req = route.request()
      if (req.isNavigationRequest() && req.frame() !== page.mainFrame()) {
        return route.abort()
      }
      return route.continue()
    })

    const fullIndexHtml = await buildFullIndexHtml()

    for (const r of ROUTES) {
      try {
        const resp = await page.goto(BASE + r.url, { waitUntil: 'networkidle', timeout: 20000 })
        await page.waitForTimeout(400)

        // 首页：注入完整优惠索引（所有 tab 的全部链接）
        if (r.fullIndex) {
          await page.evaluate((html) => {
            const app = document.getElementById('app')
            if (app && !app.querySelector('.seo-prerender-full')) {
              app.insertAdjacentHTML('beforeend', html)
            }
          }, fullIndexHtml)
          await page.waitForTimeout(100)
        }

        const html = await page.content()
        const out = path.join(DIST, r.file)
        fs.writeFileSync(out, html, 'utf-8')
        const size = fs.statSync(out).size
        const m = html.match(/<div id="app"[^>]*>([\s\S]*?)<\/div>/)
        const appInner = m ? m[1].length : 0
        const linkCount = (html.match(/<a\s[^>]*href=/g) || []).length
        const status = resp ? resp.status() : 0
        const good = status < 400 && appInner > 200
        if (!good) ok = false
        results.push(
          `${good ? '✅' : '❌'} ${r.url} → dist/${r.file} HTTP=${status} size=${size}B #app内=${appInner}B 链接数=${linkCount}`
        )
      } catch (e) {
        ok = false
        results.push(`❌ ${r.url} 失败: ${e.message.slice(0, 120)}`)
      }
    }
    await browser.close()
    // 重新生成 sitemap.xml，让 lastmod 反映预渲染后的 dist mtime
    const sitemapCount = regenerateSitemap()
    results.push(`🗺️  sitemap.xml 已重生成（${sitemapCount} 条 URL）`)
  } catch (e) {
    ok = false
    results.push(`❌ 预渲染异常: ${e.message.slice(0, 150)}`)
  } finally {
    server.kill()
  }
  console.log(results.join('\n'))
  console.log(ok ? `\n🎉 SPA 预渲染完成（${ROUTES.length} 页）` : `\n🚨 SPA 预渲染存在失败`)
  process.exit(ok ? 0 : 1)
})()

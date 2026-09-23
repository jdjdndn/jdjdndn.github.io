// 关键页面冒烟测试：构建产物 + Playwright，验证无 JS 错误、JSON-LD 可解析、关键元素存在
// 用于 CI 质量门禁（node scripts/smoke-test.cjs），失败 exit 1
const { spawn } = require('child_process');
const { chromium } = require('playwright');

const PORT = 4173;
const BASE = `http://localhost:${PORT}`;

const PAGES = [
  { url: '/', name: '首页', checks: ['#app'] },
  { url: '/huodong.html', name: '活动大厅', checks: ['h1', '#app'] },
  { url: '/haoka.html', name: '号卡', checks: ['main', 'h1'] },
  { url: '/article/爱奇艺.html', name: '文章页', checks: ['main', '.faq', '相关攻略'] },
  { url: '/article/index.html', name: '文章索引', checks: ['.entry-card', 'h1'] },
  { url: '/meituan-waimai.html', name: '着陆页', checks: ['.hero', '.faq-item'] },
  { url: '/llms.txt', name: 'llms', checks: [] },
];

function startServer() {
  // 用 node 直接执行 vite CLI（.cmd 在 Windows spawn 下不可靠，此处跨平台）
  const viteBin = require('path').resolve(process.cwd(), 'node_modules/vite/bin/vite.js');
  const child = spawn(process.execPath, [viteBin, 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(), stdio: 'ignore', windowsHide: true,
  });
  return child;
}

function waitForServer(timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      const req = require('http').get(`${BASE}/robots.txt`, (res) => {
        res.resume(); resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) reject(new Error('服务启动超时'));
        else setTimeout(tick, 500);
      });
    };
    tick();
  });
}

(async () => {
  const server = startServer();
  let ok = true;
  const results = [];
  try {
    await waitForServer();
    // CI（ubuntu runner 容器）下 chromium 需要 --no-sandbox；--disable-dev-shm-usage 防共享内存不足
    const isCI = !!process.env.CI;
    const browser = await chromium.launch({
      args: isCI
        ? ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        : [],
    });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message.slice(0, 120)}`));

    for (const p of PAGES) {
      errors.length = 0;
      try {
        const resp = await page.goto(BASE + p.url, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(300);
        const status = resp ? resp.status() : 0;

        // JSON-LD 可解析性
        let jsonldOk = true, jsonldCount = 0;
        const scripts = await page.$$('script[type="application/ld+json"]');
        for (const s of scripts) {
          const txt = await s.evaluate(el => el.textContent);
          try { JSON.parse(txt); jsonldCount++; } catch { jsonldOk = false; }
        }

        // 关键元素
        let missing = [];
        if (p.url === '/llms.txt') {
          const body = await page.evaluate(async () => (await fetch(location.href)).text());
          if (!body.includes('券宝')) missing.push('内容缺失');
        } else {
          for (const sel of p.checks) {
            const found = sel === '相关攻略'
              ? (await page.content()).includes('相关攻略')
              : await page.$(sel);
            if (!found) missing.push(sel);
          }
        }

        const pageOk = status < 400 && errors.length === 0 && jsonldOk && missing.length === 0;
        if (!pageOk) ok = false;
        results.push(`${pageOk ? '✅' : '❌'} ${p.name} (${p.url}) HTTP=${status} JSONLD=${jsonldCount}${jsonldOk ? '' : '[解析失败]'} 错误=${errors.length} 缺元素=${missing.join(',') || '无'}`);
      } catch (e) {
        ok = false;
        results.push(`❌ ${p.name} (${p.url}) 访问失败: ${e.message.slice(0, 100)}`);
      }
    }
    await browser.close();
  } catch (e) {
    ok = false;
    results.push(`❌ 冒烟失败: ${e.message.slice(0, 150)}`);
  } finally {
    server.kill();
  }
  console.log(results.join('\n'));
  console.log(ok ? '\n🎉 冒烟全部通过' : '\n🚨 冒烟存在失败');
  process.exit(ok ? 0 : 1);
})();

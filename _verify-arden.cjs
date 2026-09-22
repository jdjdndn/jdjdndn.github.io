const { spawn } = require('child_process');
const { chromium } = require('playwright');
const viteBin = require('path').resolve(process.cwd(), 'node_modules/vite/bin/vite.js');
const server = spawn(process.execPath, [viteBin, 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore', windowsHide: true });
(async () => {
  await new Promise(r => setTimeout(r, 3000));
  const browser = await chromium.launch();
  const errs = [];
  const p = await browser.newPage({ viewport: { width: 900, height: 1100 } });
  p.on('pageerror', e => errs.push(e.message.slice(0, 80)));
  await p.goto('http://localhost:4173/article/arden-green-tea-lotion.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  const info = await p.evaluate(() => ({
    title: document.title.slice(0, 34),
    cta: document.querySelector('.cta a')?.href,
    pddLink: document.querySelector('a[href*="yangkeduo"]')?.href.slice(0, 120),
    related: [...document.querySelectorAll('.related-links a')].map(a => a.textContent.trim()),
    faq: document.querySelectorAll('.faq h3').length,
    tip: !!document.querySelector('.time-tip'),
  }));
  console.log('雅顿:', JSON.stringify(info));
  await p.evaluate(() => document.querySelector('.card').scrollIntoView({ block: 'start' }));
  await p.waitForTimeout(300);
  await p.screenshot({ path: '_arden.png', fullPage: false });
  console.log('错误:', errs.length ? errs.join(' | ') : '(无)');
  await browser.close();
  server.kill();
})();

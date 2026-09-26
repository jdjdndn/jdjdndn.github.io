const fs = require('fs');
const path = require('path');
const root = path.resolve('src');
// 收集 src 下所有 html + views vue 页面名（vue 页面构建后为根级 html）
const vuePages = new Set();
fs.readdirSync(path.join(root, 'views')).forEach(f => {
  if (f.endsWith('.vue')) vuePages.add(f.replace('.vue', '') + '.html');
  if (f.endsWith('.html')) vuePages.add(f);
});
const vh = path.join(root, 'views', 'haoka');
if (fs.existsSync(vh)) fs.readdirSync(vh).forEach(f => { if (f.endsWith('.vue')) vuePages.add(f.replace('.vue', '') + '.html'); });
const hasVue = name => { const lower = name.toLowerCase(); return [...vuePages].some(s => s.toLowerCase() === lower); };
// 遍历 article 所有 html
const files = [];
(function walk(d) {
  fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  });
})(path.join(root, 'article'));

const broken = [];
let totalHref = 0;
for (const f of files) {
  const dir = path.dirname(f);
  const c = fs.readFileSync(f, 'utf8');
  const re = /href="([^"#]+\.html)"/g;
  let m;
  while ((m = re.exec(c)) !== null) {
    let h = m[1];
    if (!h.startsWith('.') && !h.startsWith('/')) continue; // 只查相对/绝对站内
    totalHref++;
    if (h.startsWith('/')) {
      const name = h.replace(/^\//, '');
      if (name.startsWith('article/')) {
        const target = path.join(root, name);
        if (!fs.existsSync(target)) broken.push(`${path.basename(f)} -> ${h}`);
      } else {
        if (!hasVue(name) && !fs.existsSync(path.join(root, name))) broken.push(`${path.basename(f)} -> ${h}`);
      }
    } else {
      const target = path.resolve(dir, h);
      if (!fs.existsSync(target) && !hasVue(path.basename(target))) {
        broken.push(`${path.basename(f)} -> ${h}`);
      }
    }
  }
}
console.log('article 内 href 总数:', totalHref);
console.log('真死链数:', broken.length);
const uniq = [...new Set(broken)];
uniq.slice(0, 150).forEach(b => console.log('  ', b));
fs.writeFileSync('_deadlinks.txt', uniq.join('\n'), 'utf8');
console.log('已写 _deadlinks.txt');

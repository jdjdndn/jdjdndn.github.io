const fs = require('fs');
const path = require('path');
const dir = 'src/article';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');
// 抽查 12 篇：结构完整性 + 相关攻略内容
const samples = ['360壁纸.html', 'haoka-mianfei.html', '美团外卖红包.html', 'bilibili大会员.html', '1号店.html', '腾讯视频会员.html'];
let broken = 0, ok = 0;
const stats = { withRelated: 0, withoutRelated: 0, badPos: 0 };
for (const f of files) {
  const c = fs.readFileSync(path.join(dir, f), 'utf-8');
  const hasRelated = c.includes('<h2>相关攻略</h2>');
  if (hasRelated) stats.withRelated++; else stats.withoutRelated++;
  // 位置检查：相关攻略在 FAQ 之后、CTA 之前
  if (hasRelated) {
    const iRel = c.indexOf('<h2>相关攻略</h2>');
    const iCta = c.indexOf('<div class="cta">');
    const iFaq = c.lastIndexOf('常见问题');
    if (!(iFaq < iRel && iRel < iCta)) stats.badPos++;
  }
  // 基本结构完整性
  if ((c.match(/<section/g) || []).length !== (c.match(/<\/section>/g) || []).length) broken++;
  else ok++;
}
console.log('总篇数:', files.length, ' 相关攻略:', stats.withRelated, ' 无:', stats.withoutRelated, ' 位置异常:', stats.badPos);
console.log('section 配对: 正常', ok, ' 异常', broken);
// 打印样本的相关攻略
for (const s of samples) {
  const p = path.join(dir, s);
  if (!fs.existsSync(p)) continue;
  const c = fs.readFileSync(p, 'utf-8');
  const m = c.match(/<h2>相关攻略<\/h2>[\s\S]*?<div class="related-links">\s*([\s\S]*?)\s*<\/div>/);
  if (m) console.log(s, '=>', m[1].split(/\r?\n/).map(x => x.trim()).filter(Boolean).join('  '));
  else console.log(s, '=> (无相关攻略)');
}

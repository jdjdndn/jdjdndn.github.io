// 深度 SEO 审计：924 页全量扫描
const fs = require('fs');
const path = require('path');
const dist = path.resolve('dist');
const results = { total: 0, noTitle: 0, longTitle: 0, noDesc: 0, noH1: 0, multiH1: 0, noCanonical: 0, noJsonLd: 0, noOg: 0, noLang: 0, noFavicon: 0, jsonldTypes: {}, titleLengths: [], ogMissing: [], h1Samples: [] };
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}
const files = walk(dist);
results.total = files.length;
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const rel = path.relative(dist, f).replace(/\\/g, '/');
  // title
  const t = c.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!t || !t[1].trim()) results.noTitle++;
  else {
    const len = t[1].trim().length;
    results.titleLengths.push(len);
    if (len > 70) results.longTitle++;
  }
  // desc
  if (!/name="description"/i.test(c)) results.noDesc++;
  // h1
  const h1s = (c.match(/<h1[\s>]/gi) || []).length;
  if (h1s === 0) results.noH1++;
  if (h1s > 1) results.multiH1++;
  // canonical
  if (!/rel="canonical"/i.test(c)) results.noCanonical++;
  // JSON-LD
  const ld = c.match(/application\/ld\+json/gi) || [];
  if (ld.length === 0) results.noJsonLd++;
  for (const m of c.matchAll(/"@type"\s*:\s*"([^"]+)"/g)) results.jsonldTypes[m[1]] = (results.jsonldTypes[m[1]] || 0) + 1;
  // OG
  if (!/property="og:title"/i.test(c) || !/property="og:description"/i.test(c)) { results.noOg++; results.ogMissing.push(rel); }
  // lang
  if (!/<html[^>]*lang=/i.test(c)) results.noLang++;
  // favicon
  if (!/rel="icon"/i.test(c) && !/rel="shortcut icon"/i.test(c)) results.noFavicon++;
  // h1 text sample
  if (h1s === 1) { const h = c.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i); if (h) results.h1Samples.push(rel + ' => ' + h[1].replace(/<[^>]+>/g, '').trim().slice(0, 30)); }
}
const avg = (a) => a.length ? (a.reduce((s, x) => s + x, 0) / a.length).toFixed(0) : '-';
const sorted = [...results.titleLengths].sort((a, b) => b - a);
console.log(`总页数: ${results.total}`);
console.log(`无title: ${results.noTitle} / 超70字: ${results.longTitle} (最长 ${sorted[0]}, 平均 ${avg(results.titleLengths)})`);
console.log(`无description: ${results.noDesc} / 无h1: ${results.noH1} / 多h1: ${results.multiH1}`);
console.log(`无canonical: ${results.noCanonical} / 无JSON-LD: ${results.noJsonLd} / 无OG: ${results.noOg} / 无lang: ${results.noLang} / 无favicon: ${results.noFavicon}`);
console.log('JSON-LD 类型统计:', JSON.stringify(results.jsonldTypes));
if (results.noDesc > 0) console.log('样例(长title):', results.h1Samples.slice(0, 5));

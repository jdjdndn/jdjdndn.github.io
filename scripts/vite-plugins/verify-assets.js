// 构建后校验：检测 dist 中 HTML 引用的相对静态资源是否存在（防部署 404）
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { ROOT } from './shared.js';

export default function verifyAssetsPlugin() {
  return {
    name: 'verify-assets',
    closeBundle() {
      const distDir = resolve(ROOT, 'dist');
      const collectHtml = (dir, out = []) => {
        for (const f of readdirSync(dir)) {
          const fp = resolve(dir, f);
          if (statSync(fp).isDirectory()) collectHtml(fp, out);
          else if (f.endsWith('.html')) out.push(fp);
        }
        return out;
      };
      const htmlFiles = collectHtml(distDir);

      const missing = [];
      for (const htmlPath of htmlFiles) {
        const html = basename(htmlPath);
        const htmlDir = dirname(htmlPath);
        const content = readFileSync(htmlPath, 'utf-8');
        // 提取 src="./xxx" 和 href="./xxx" 中的相对路径（排除 http/data/#），按 HTML 所在目录解析。
        // 只校验静态资源类文件；.html/.htm 是页面间导航链接，不属于资源（着陆页在构建后阶段生成）
        const refPattern = /(?:src|href)="\.\/([^"#]+)"/g;
        const isResource = /\.(js|mjs|cjs|css|png|jpe?g|svg|gif|webp|avif|ico|woff2?|eot|ttf|otf|json|webmanifest|txt|xml|pdf|mp4|webm|ogg|mp3|wav)$/i;
        let m;
        while ((m = refPattern.exec(content)) !== null) {
          const ref = m[1];
          if (!isResource.test(ref)) continue;
          const resolved = resolve(htmlDir, ref);
          if (!existsSync(resolved)) missing.push({ html, ref });
        }
      }
      if (missing.length > 0) {
        console.error('\n❌ 构建校验失败：以下资源在 dist/ 中不存在，部署后会 404：');
        for (const { html, ref } of missing) console.error(`   ${html} → ./${ref}`);
        console.error('\n如果是 Web Component 的 JS/CSS，请放到 public/ 目录。\n');
        process.exit(1);
      }
      console.log(`✅ 构建校验通过：${htmlFiles.length} 个 HTML 文件静态资源引用有效`);
    },
  };
}

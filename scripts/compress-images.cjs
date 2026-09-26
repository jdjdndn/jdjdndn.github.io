// 构建后图片压缩：压缩 dist 下体积较大的 jpg/png/webp（保留格式，保证可扫性/清晰度）
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const MIN_SIZE = 8 * 1024; // 小于 8KB 不压缩（收益低）
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, out);
    } else if (EXT.has(path.extname(entry.name).toLowerCase())) {
      const stat = fs.statSync(full);
      if (stat.size >= MIN_SIZE) out.push(full);
    }
  }
}

(async () => {
  const files = [];
  await walk(DIST, files);
  let saved = 0;
  let totalBefore = 0;
  let totalAfter = 0;
  for (const file of files) {
    const before = fs.statSync(file).size;
    const ext = path.extname(file).toLowerCase();
    try {
      let img = sharp(file);
      const meta = await img.metadata();
      if (ext === '.jpg' || ext === '.jpeg') {
        img = img.jpeg({ quality: 82, mozjpeg: true });
      } else if (ext === '.png') {
        img = img.png({ compressionLevel: 9, palette: meta.palette ? true : false });
      } else if (ext === '.webp') {
        img = img.webp({ quality: 82 });
      }
      await img.toFile(file + '.tmp');
      const after = fs.statSync(file + '.tmp').size;
      if (after < before) {
        fs.renameSync(file + '.tmp', file);
        saved += before - after;
        totalBefore += before;
        totalAfter += after;
        console.log(`  ✓ ${path.relative(DIST, file)}  ${(before / 1024).toFixed(1)}KB → ${(after / 1024).toFixed(1)}KB  (-${(((before - after) / before) * 100).toFixed(0)}%)`);
      } else {
        fs.unlinkSync(file + '.tmp');
        totalBefore += before;
        totalAfter += before;
      }
    } catch (e) {
      console.log(`  ✗ ${path.relative(DIST, file)} 压缩失败: ${e.message}`);
    }
  }
  console.log(`✅ 图片压缩完成：${files.length} 个 ≥8KB 图片，总大小 ${(totalBefore / 1024 / 1024).toFixed(2)}MB → ${(totalAfter / 1024 / 1024).toFixed(2)}MB，节省 ${(saved / 1024 / 1024).toFixed(2)}MB`);
})();

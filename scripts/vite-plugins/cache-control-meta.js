// 页面禁用缓存（优惠数据时效性强）
export default function cacheControlMetaPlugin() {
  return {
    name: 'cache-control-meta',
    transformIndexHtml(html) {
      const meta = '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />';
      return html.replace('<head>', `<head>\n    ${meta}`);
    },
  };
}

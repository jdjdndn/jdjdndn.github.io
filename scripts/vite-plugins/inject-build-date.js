// 构建时注入 __BUILD_DATE__ → 当天日期
export default function injectBuildDatePlugin() {
  return {
    name: 'inject-build-date',
    transformIndexHtml(html) {
      const today = new Date().toISOString().slice(0, 10);
      return html.replaceAll('__BUILD_DATE__', today);
    },
  };
}

/**
 * 骨架屏组件 - 公共模块
 * 提供加载中的占位符 UI
 */

/**
 * 渲染骨架屏网格
 * @param {number} count - 骨架卡片数量
 * @param {'mixed'|'code'|'link'|'jingxuan'} type - 骨架类型
 * @returns {string} 骨架屏 HTML
 */
export const renderSkeletonGrid = (count = 6, type = 'mixed') => {
  const cards = Array.from({ length: count }, (_, i) => {
    // 根据类型和位置生成不同骨架
    const cardType = type === 'mixed' ? (i % 3 === 0 ? 'code' : (i % 3 === 1 ? 'link' : 'jingxuan')) : type;

    if (cardType === 'jingxuan') {
      // 精选卡片骨架：图片+文字
      return `
        <div class="skeleton-card skeleton-jingxuan">
          <div class="skeleton skeleton-img"></div>
          <div class="skeleton skeleton-line full"></div>
          <div class="skeleton skeleton-line short"></div>
        </div>
      `;
    }

    if (cardType === 'link') {
      // 链接卡片骨架：无口令框，有按钮
      return `
        <div class="skeleton-card skeleton-link">
          <div class="skeleton skeleton-line full"></div>
          <div class="skeleton skeleton-line medium"></div>
          <div class="skeleton skeleton-link-url"></div>
          <div class="skeleton-btn-group">
            <div class="skeleton skeleton-btn primary"></div>
            <div class="skeleton skeleton-btn secondary"></div>
          </div>
        </div>
      `;
    }

    // 口令卡片骨架（默认）
    return `
      <div class="skeleton-card skeleton-code">
        <div class="skeleton skeleton-line full"></div>
        <div class="skeleton skeleton-line medium"></div>
        <div class="skeleton skeleton-code-box"></div>
        <div class="skeleton-btn-group">
          <div class="skeleton skeleton-btn primary"></div>
          <div class="skeleton skeleton-btn secondary"></div>
        </div>
      </div>
    `;
  }).join('');
  return `<div class="skeleton-grid">${cards}</div>`;
};

/**
 * 渲染简单骨架屏（用于列表页）
 * @param {number} count - 骨架行数
 * @returns {string} 骨架屏 HTML
 */
export const renderSimpleSkeleton = (count = 4) => {
  const rows = Array.from({ length: count }, () => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-line full"></div>
      <div class="skeleton skeleton-line short"></div>
      <div class="skeleton-btn-group">
        <div class="skeleton skeleton-btn primary"></div>
      </div>
    </div>
  `).join('');
  return `<div class="skeleton-grid">${rows}</div>`;
};

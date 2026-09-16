// ============================================================
//  轻量埋点模块
//  - 优先使用 Umami（如已接入）发送事件
//  - 同时在 localStorage 记录本地统计（方便调试/离线查看）
//  - 用法: track('event_name', { key: value })
// ============================================================

const STORAGE_KEY = 'coupon_analytics';
const MAX_EVENTS = 500; // localStorage 最多保留条数

/** 获取本地事件存储 */
function getStoredEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/** 存储事件到 localStorage */
function storeEvent(event, data) {
  const events = getStoredEvents();
  events.push({
    event,
    data,
    ts: Date.now(),
  });
  // 超过上限时裁剪旧数据
  if (events.length > MAX_EVENTS) {
    events.splice(0, events.length - MAX_EVENTS);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

/**
 * 追踪事件
 * @param {string} event - 事件名
 * @param {object} data - 附加数据
 */
export function track(event, data = {}) {
  // 1. 发送到 Umami（如果已接入）
  if (typeof window !== 'undefined' && window.umami) {
    try {
      window.umami.track(event, data);
    } catch {}
  }

  // 2. 存储到 localStorage
  storeEvent(event, data);
}

/**
 * 获取本地统计摘要（控制台调试用）
 * 在浏览器控制台执行: couponAnalytics.summary()
 */
export function getSummary() {
  const events = getStoredEvents();
  const summary = {};

  events.forEach(({ event }) => {
    summary[event] = (summary[event] || 0) + 1;
  });

  return {
    totalEvents: events.length,
    events: summary,
    recent: events.slice(-20),
  };
}

// 挂载到 window 供控制台调试
if (typeof window !== 'undefined') {
  window.couponAnalytics = { summary: getSummary, events: getStoredEvents };
}

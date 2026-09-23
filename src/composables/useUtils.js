/**
 * 通用工具函数 composable
 * 替代原 utils.js 中的工具函数
 */

/**
 * 防抖：延迟执行，连续触发时重新计时
 */
export const debounce = (fn, ms = 150) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

/**
 * 过期判断
 */
export const isExpired = (deadline) => {
  if (!deadline) return false
  const d = new Date(deadline)
  return d < new Date()
}

export const isExpiringSoon = (deadline) => {
  if (!deadline) return false
  const d = new Date(deadline)
  const now = new Date()
  const diff = d - now
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000
}

export const isNewActivity = (item) => {
  const hash = [...(item.name || '')].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
  return Math.abs(hash) % 10 < 3
}

export const isHotActivity = (item) => {
  const hash = [...(item.name || '')].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
  return Math.abs(hash) % 10 < 4
}

export const formatCountdown = (deadline) => {
  if (!deadline) return ''
  const d = new Date(deadline)
  const now = new Date()
  const diff = d - now
  if (diff <= 0) return '已过期'

  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))

  if (days > 30) return `截止 ${deadline}`
  if (days > 0) return `⏰ ${days}天${hours}小时后过期`
  if (hours > 0) return `⏰ ${hours}小时后过期`
  return '⏰ 即将过期'
}

/**
 * 搜索高亮
 */
export const highlightText = (text, query) => {
  if (!query || !text) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="search-highlight">$1</mark>')
}

/**
 * sections 规范化
 */
export const normalizeSections = (sections) => {
  if (!sections || !Array.isArray(sections)) {
    return []
  }
  return sections.filter(s => s != null).map((s) => {
    if (typeof s === 'string') {
      const lines = s.split('\n').map((l) => l.trim()).filter(Boolean)
      const name = lines[0] || s.slice(0, 30)
      const linkMatch = s.match(/【下单链接】(https?:\/\/\S+)/)
      return {
        title: name.slice(0, 20),
        items: linkMatch
          ? [{ name, link: linkMatch[1] }]
          : [{ name, code: s }],
      }
    }
    return s
  })
}

/**
 * 数字滚动动画
 */
export const countUp = (el, target, duration = 800) => {
  if (!el || target <= 0) return
  const start = performance.now()
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
    el.textContent = Math.floor(target * eased).toLocaleString()
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/**
 * 根据名称判断图标
 */
export const getIconForName = (name) => {
  if (/电影|影院|观影/.test(name)) return '🎬'
  if (/外卖|美团/.test(name)) return '🍜'
  if (/电商|购物|淘宝|京东|拼多多|商城|超市/.test(name)) return '🛒'
  if (/酒店|住宿|民宿|宾馆/.test(name)) return '🏨'
  if (/旅行|旅游|携程|同程|飞猪|出行|机票|火车/.test(name)) return '✈️'
  if (/餐饮|美食|咖啡|茶|奶茶|餐厅|火锅/.test(name)) return '🍽️'
  if (/花|鲜花|礼品/.test(name)) return '🌸'
  if (/云|服务器|主机|域名/.test(name)) return '☁️'
  if (/打车|滴滴|出行|代驾/.test(name)) return '🚗'
  if (/快递|寄件|物流/.test(name)) return '📦'
  if (/话费|流量|充值/.test(name)) return '📱'
  if (/优惠|红包|券|折扣|补贴/.test(name)) return '🎁'
  if (/会员|VIP/.test(name)) return '👑'
  return '🎫'
}

/**
 * 使用工具函数的 composable
 */
export function useUtils() {
  return {
    debounce,
    isExpired,
    isExpiringSoon,
    isNewActivity,
    isHotActivity,
    formatCountdown,
    highlightText,
    normalizeSections,
    countUp,
    getIconForName
  }
}

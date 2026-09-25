/**
 * 统一链接跳转方案
 * 处理所有类型的链接跳转：微信链接、小程序链接、普通链接等
 */

/**
 * 检测是否为微信环境
 * @returns {boolean}
 */
export const isWeixinEnv = () => /MicroMessenger/i.test(navigator.userAgent)

/**
 * 检测是否为移动端
 * @returns {boolean}
 */
export const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

/**
 * 检测链接类型
 * @param {string} url - 链接地址
 * @returns {string} 链接类型：'weixin' | 'miniprogram' | 'http' | 'article' | 'route' | 'unknown'
 */
export const getLinkType = (url) => {
  if (!url) return 'unknown'

  if (url.startsWith('weixin://')) return 'weixin'
  if (url.startsWith('#小程序://') || url.startsWith('mp://')) return 'miniprogram'
  if (url.startsWith('http://') || url.startsWith('https://')) return 'http'
  if (url.startsWith('/article/')) return 'article'
  if (url.startsWith('/')) return 'route'

  return 'unknown'
}

/**
 * 判断是否为微信/小程序链接
 * @param {string} url - 链接地址
 * @returns {boolean}
 */
export const isWechatLink = (url) => {
  const linkType = getLinkType(url)
  return linkType === 'weixin' || linkType === 'miniprogram'
}

/**
 * 处理微信/小程序链接
 * @param {string} url - 链接地址
 * @param {object} options - 配置选项
 * @param {function} options.onWeixin - 微信环境中的处理函数
 * @param {function} options.onNonWeixin - 非微信环境中的处理函数
 * @param {string} options.name - 链接名称（用于提示）
 */
export const handleWechatLink = (url, options = {}) => {
  const { onWeixin, onNonWeixin, name } = options

  if (isWechatLink(url)) {
    if (isWeixinEnv()) {
      // 微信环境中直接跳转
      if (onWeixin) onWeixin(url)
      else window.location.href = url
    } else {
      // 非微信环境中：复制链接并提示
      if (onNonWeixin) {
        onNonWeixin(url)
      } else {
        // 默认行为：复制到剪贴板并显示提示
        navigator.clipboard.writeText(url).then(() => {
          // 触发自定义事件，让父组件可以监听
          const event = new CustomEvent('wechat-link-copied', {
            detail: { url, name: name || url }
          })
          window.dispatchEvent(event)
        }).catch(() => {
          // 降级方案：使用 alert
          alert('请在微信中打开此链接')
        })
      }
    }
    return true
  }

  return false
}

/**
 * 统一链接跳转函数
 * @param {Event} event - 点击事件（可选）
 * @param {string} url - 链接地址
 * @param {object} options - 配置选项
 * @param {string} options.router - Vue Router 实例（可选）
 * @param {function} options.onWeixin - 微信环境中的处理函数（可选）
 * @param {function} options.onNonWeixin - 非微信环境中的处理函数（可选）
 */
export const navigateTo = (event, url, options = {}) => {
  const linkType = getLinkType(url)

  // 处理微信/小程序链接
  if (linkType === 'weixin' || linkType === 'miniprogram') {
    if (event) event.preventDefault()
    handleWechatLink(url, options)
    return
  }

  // 处理普通 HTTP 链接
  if (linkType === 'http') {
    // 保持默认行为，不阻止事件
    return
  }

  // 处理文章链接（重定向到静态 HTML）
  if (linkType === 'article') {
    if (event) event.preventDefault()
    const baseUrl = import.meta.env.BASE_URL || '/'
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
    window.location.href = `${normalizedBase}${url.slice(1)}`
    return
  }

  // 处理 Vue 路由链接
  if (linkType === 'route') {
    if (event) event.preventDefault()
    if (options.router) {
      options.router.push(url)
    } else {
      window.location.href = url
    }
    return
  }
}

/**
 * 生成微信链接的 onclick 属性（用于模板字符串）
 * @param {string} url - 链接地址
 * @returns {string} onclick 属性字符串
 */
export const getWeixinOnclick = (url) => {
  if (isWechatLink(url)) {
    return ` onclick="if(!/MicroMessenger/i.test(navigator.userAgent)){alert('请在微信中打开此链接');return false;}"`
  }
  return ''
}
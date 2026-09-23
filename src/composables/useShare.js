/**
 * 分享功能 composable
 * 替代原 share.js 中的分享功能
 */
import { ref } from 'vue'
import { useClipboard } from './useClipboard'

export function useShare() {
  const clipboard = useClipboard()
  const showPanel = ref(false)
  const shareData = ref({
    name: '',
    url: '',
    text: ''
  })

  /**
   * 检测是否为移动端
   */
  const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  /**
   * 分享到微信（复制内容）
   */
  const shareToWechat = async (name, url, text) => {
    const content = text || `${name} ${url}`
    // 优先尝试系统分享面板
    if (navigator.share) {
      try {
        await navigator.share({ title: name, text: content, url })
        return 'native'
      } catch {}
    }
    // 回退到复制
    await clipboard.copy(content, '已复制，请打开微信粘贴给好友')
    return 'copied'
  }

  /**
   * 分享到 QQ（复制内容）
   */
  const shareToQQ = async (name, url, text) => {
    const content = text || `${name} ${url}`
    await clipboard.copy(content, '已复制，请打开QQ粘贴给好友')
    return 'copied'
  }

  /**
   * 分享到微博
   */
  const shareToWeibo = (name, url, text) => {
    const shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(name)}&pic=${encodeURIComponent(text || '')}`
    window.open(shareUrl, '_blank', 'noopener,width=600,height=500')
  }

  /**
   * 打开分享面板
   */
  const openShare = (name, url, text) => {
    shareData.value = { name, url: url || window.location.href, text: text || '' }
    showPanel.value = true
  }

  /**
   * 关闭分享面板
   */
  const closeShare = () => {
    showPanel.value = false
  }

  /**
   * 执行分享操作
   */
  const handleShare = async (action) => {
    const { name, url, text } = shareData.value

    switch (action) {
      case 'wechat':
        await shareToWechat(name, url, text)
        break
      case 'qq':
        await shareToQQ(name, url, text)
        break
      case 'weibo':
        shareToWeibo(name, url, text)
        break
      case 'copy-link':
        await clipboard.copyLink(url, name)
        break
      case 'copy-text':
        await clipboard.copy(text || url, text ? '口令已复制' : '链接已复制')
        break
    }

    closeShare()
  }

  /**
   * 快速分享（优先原生分享）
   */
  const quickShare = async (name, url, text) => {
    if (navigator.share) {
      const shareDataObj = text
        ? { title: name, text }
        : { title: name, url }
      try {
        await navigator.share(shareDataObj)
        return
      } catch {}
    }
    // 降级到分享面板
    openShare(name, url, text)
  }

  return {
    showPanel,
    shareData,
    isMobile,
    shareToWechat,
    shareToQQ,
    shareToWeibo,
    openShare,
    closeShare,
    handleShare,
    quickShare
  }
}

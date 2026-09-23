/**
 * 剪贴板操作 composable
 * 替代原 base.js 中的 copyText、robustCopy 函数
 */
import { useToast } from './useToast'

export function useClipboard() {
  const toast = useToast()

  /**
   * 触觉反馈
   */
  const vibrate = (ms = 50) => {
    if (navigator.vibrate) navigator.vibrate(ms)
  }

  /**
   * 复制文本到剪贴板（含降级方案）
   * @param {string} text - 要复制的文本
   * @param {string} successMsg - 成功提示信息
   * @returns {Promise<boolean>} 是否复制成功
   */
  const copy = async (text, successMsg = '已复制') => {
    try {
      await navigator.clipboard.writeText(text)
      vibrate()
      toast.show(successMsg)
      return true
    } catch {
      // 降级方案：使用 textarea
      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.cssText = 'position:fixed;left:-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        vibrate()
        toast.show(successMsg)
        return true
      } catch {
        toast.show('复制失败，请长按手动复制')
        return false
      }
    }
  }

  /**
   * 复制链接
   * @param {string} url - 链接地址
   * @param {string} name - 名称（用于提示）
   */
  const copyLink = async (url, name = '') => {
    const msg = name ? `${name} 链接已复制` : '链接已复制'
    return copy(url, msg)
  }

  /**
   * 复制口令
   * @param {string} code - 口令内容
   * @param {string} name - 名称（用于提示）
   */
  const copyCode = async (code, name = '') => {
    const msg = name ? `${name} 口令已复制` : '口令已复制'
    return copy(code, msg)
  }

  return {
    copy,
    copyLink,
    copyCode,
    vibrate
  }
}

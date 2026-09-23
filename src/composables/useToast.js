/**
 * Toast 通知 composable
 * 替代原 base.js 中的 showToast 函数
 */
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
let timer = null

export function useToast() {
  const show = (msg = '已复制', duration = 2500) => {
    message.value = msg
    visible.value = true

    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      visible.value = false
    }, duration)
  }

  const hide = () => {
    visible.value = false
    if (timer) clearTimeout(timer)
  }

  return {
    visible,
    message,
    show,
    hide
  }
}

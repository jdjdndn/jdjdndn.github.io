import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 应用状态
  const theme = ref('light') // light | dark
  const isMenuOpen = ref(false)
  const isLoading = ref(false)
  const notifications = ref([])

  // 切换主题
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
  }

  // 设置主题
  function setTheme(newTheme) {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // 切换菜单
  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }

  // 关闭菜单
  function closeMenu() {
    isMenuOpen.value = false
  }

  // 设置加载状态
  function setLoading(status) {
    isLoading.value = status
  }

  // 添加通知
  function addNotification(notification) {
    const id = Date.now()
    notifications.value.push({ ...notification, id })
    setTimeout(() => {
      removeNotification(id)
    }, notification.duration || 3000)
  }

  // 移除通知
  function removeNotification(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  // 初始化
  function init() {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // 检查系统偏好
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark')
      }
    }
  }

  return {
    theme,
    isMenuOpen,
    isLoading,
    notifications,
    toggleTheme,
    setTheme,
    toggleMenu,
    closeMenu,
    setLoading,
    addNotification,
    removeNotification,
    init
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 用户状态
  const isLoggedIn = ref(false)
  const userInfo = ref(null)
  const favorites = ref([])
  const history = ref([])

  // 登录
  function login(userData) {
    isLoggedIn.value = true
    userInfo.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // 登出
  function logout() {
    isLoggedIn.value = false
    userInfo.value = null
    localStorage.removeItem('user')
  }

  // 添加收藏
  function addFavorite(item) {
    if (!favorites.value.find(f => f.id === item.id)) {
      favorites.value.push(item)
      localStorage.setItem('favorites', JSON.stringify(favorites.value))
    }
  }

  // 移除收藏
  function removeFavorite(id) {
    favorites.value = favorites.value.filter(f => f.id !== id)
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  // 添加历史记录
  function addHistory(item) {
    history.value = [item, ...history.value.slice(0, 49)] // 最多保留50条
    localStorage.setItem('history', JSON.stringify(history.value))
  }

  // 初始化
  function init() {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      isLoggedIn.value = true
      userInfo.value = JSON.parse(savedUser)
    }

    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      favorites.value = JSON.parse(savedFavorites)
    }

    const savedHistory = localStorage.getItem('history')
    if (savedHistory) {
      history.value = JSON.parse(savedHistory)
    }
  }

  return {
    isLoggedIn,
    userInfo,
    favorites,
    history,
    login,
    logout,
    addFavorite,
    removeFavorite,
    addHistory,
    init
  }
})

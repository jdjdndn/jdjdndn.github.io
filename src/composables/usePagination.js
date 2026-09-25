/**
 * 分页 composable
 * 提取自 Haoka.vue、Creditcard.vue、FuyePage.vue 的重复分页逻辑
 */
import { ref, computed, watch } from 'vue'

/**
 * @param {import('vue').Ref<Array>} listRef - 响应式列表数据
 * @param {object} options - 配置选项
 * @param {number} options.pageSize - 每页条数，默认 9
 * @param {number} options.maxVisible - 最大显示页码数，默认 5
 */
export function usePagination(listRef, options = {}) {
  const { pageSize = 9, maxVisible = 5 } = options

  const currentPage = ref(1)

  const totalPages = computed(() => Math.ceil(listRef.value.length / pageSize))

  const pagedList = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return listRef.value.slice(start, start + pageSize)
  })

  const displayPages = computed(() => {
    const total = totalPages.value
    const cur = currentPage.value
    if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1)
    const pages = []
    pages.push(1)
    if (cur > 3) pages.push('...')
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) {
      pages.push(i)
    }
    if (cur < total - 2) pages.push('...')
    pages.push(total)
    return pages
  })

  function goToPage(page) {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }

  function resetPage() {
    currentPage.value = 1
  }

  return {
    currentPage,
    totalPages,
    pagedList,
    displayPages,
    goToPage,
    resetPage
  }
}
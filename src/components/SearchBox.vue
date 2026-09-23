<template>
  <div class="search-box" :class="{ 'search-box--focused': isFocused }">
    <div class="search-input-wrapper">
      <SvgIcon name="search" :size="18" class="search-icon" />
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        class="search-input"
        :placeholder="placeholder"
        aria-autocomplete="list"
        aria-controls="search-results"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <button
        v-if="searchQuery"
        class="search-clear"
        aria-label="清除搜索"
        @click="clearSearch"
      >
        <SvgIcon name="close" :size="16" />
      </button>
    </div>

    <!-- 搜索历史 -->
    <Transition name="dropdown">
      <div v-if="showHistory && searchHistory.length > 0" class="search-history">
        <div class="search-history-header">
          <span>最近搜索</span>
          <button class="search-history-clear" @click="clearHistory">清除</button>
        </div>
        <div
          v-for="item in searchHistory"
          :key="item"
          class="search-history-item"
          @click="selectHistory(item)"
        >
          <SvgIcon name="stats_expired" :size="14" />
          {{ item }}
        </div>
      </div>
    </Transition>

    <!-- 搜索结果统计 -->
    <div v-if="searchQuery && resultCount >= 0" class="search-count">
      找到 {{ resultCount }} 个匹配结果
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import SvgIcon from './SvgIcon.vue'
import { debounce } from '../composables/useUtils'

const props = defineProps({
  placeholder: {
    type: String,
    default: '搜索优惠...'
  },
  modelValue: {
    type: String,
    default: ''
  },
  resultCount: {
    type: Number,
    default: -1
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

const inputRef = ref(null)
const searchQuery = ref(props.modelValue)
const isFocused = ref(false)
const showHistory = ref(false)
const searchHistory = ref([])

// 从 localStorage 加载搜索历史
const loadHistory = () => {
  try {
    searchHistory.value = JSON.parse(localStorage.getItem('searchHistory') || '[]')
  } catch {
    searchHistory.value = []
  }
}

// 保存搜索历史
const saveHistory = (query) => {
  if (!query.trim()) return
  const history = searchHistory.value.filter(h => h !== query)
  history.unshift(query)
  if (history.length > 5) history.length = 5
  localStorage.setItem('searchHistory', JSON.stringify(history))
  searchHistory.value = history
}

// 清除搜索历史
const clearHistory = () => {
  localStorage.removeItem('searchHistory')
  searchHistory.value = []
}

// 选择历史记录
const selectHistory = (query) => {
  searchQuery.value = query
  emit('update:modelValue', query)
  emit('search', query)
  showHistory.value = false
}

// 防抖搜索
const debouncedSearch = debounce((query) => {
  emit('search', query)
}, 150)

const handleInput = () => {
  emit('update:modelValue', searchQuery.value)
  if (searchQuery.value.trim()) {
    saveHistory(searchQuery.value)
    debouncedSearch(searchQuery.value)
  } else {
    emit('clear')
  }
}

const handleFocus = () => {
  isFocused.value = true
  if (!searchQuery.value.trim()) {
    loadHistory()
    showHistory.value = true
  }
}

const handleBlur = () => {
  isFocused.value = false
  setTimeout(() => {
    showHistory.value = false
  }, 200)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

// 监听外部值变化
watch(() => props.modelValue, (val) => {
  searchQuery.value = val
})

// 暴露 focus 方法
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur()
})
</script>

<style scoped>
.search-box {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-secondary, #6b7280);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 36px;
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 8px;
  font-size: 14px;
  background: var(--card, #fff);
  color: var(--text, #1f2937);
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary, #FF6B35);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.search-input::placeholder {
  color: var(--text-secondary, #9ca3af);
}

.search-clear {
  position: absolute;
  right: 8px;
  padding: 4px;
  border: none;
  background: transparent;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-clear:hover {
  background: var(--hover-bg, #f3f4f6);
}

.search-history {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
}

.search-history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  border-bottom: 1px solid var(--border, #e5e7eb);
}

.search-history-clear {
  border: none;
  background: transparent;
  color: var(--primary, #FF6B35);
  cursor: pointer;
  font-size: 12px;
}

.search-history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: var(--text, #1f2937);
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-history-item:hover {
  background: var(--hover-bg, #f3f4f6);
}

.search-count {
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 暗色模式 */
[data-theme="dark"] .search-input {
  background: rgba(31, 41, 55, 0.5);
  border-color: rgba(75, 85, 99, 0.5);
  color: #f3f4f6;
}

[data-theme="dark"] .search-history {
  background: rgba(31, 41, 55, 0.95);
  border-color: rgba(75, 85, 99, 0.5);
}
</style>

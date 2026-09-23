<template>
  <div ref="barRef" class="page-progress"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const barRef = ref(null)

onMounted(() => {
  if (!barRef.value) return

  const bar = barRef.value
  const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#FF6B35'
  const primaryHover = getComputedStyle(document.documentElement).getPropertyValue('--primary-hover').trim() || primary

  bar.style.background = `linear-gradient(90deg, ${primary}, ${primaryHover})`
  bar.style.boxShadow = `0 0 10px ${primary}`

  requestAnimationFrame(() => {
    bar.style.width = '90%'
    setTimeout(() => {
      bar.style.width = '100%'
      bar.style.opacity = '0'
    }, 300)
    setTimeout(() => {
      bar.style.display = 'none'
    }, 600)
  })
})
</script>

<style scoped>
.page-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0;
  z-index: 10001;
  transition: width 0.3s ease, opacity 0.3s ease;
  pointer-events: none;
}
</style>

<template>
  <div class="skeleton-grid">
    <SkeletonCard
      v-for="(_, index) in count"
      :key="index"
      :type="getCardType(index)"
    />
  </div>
</template>

<script setup>
import SkeletonCard from './SkeletonCard.vue'

const props = defineProps({
  count: {
    type: Number,
    default: 6
  },
  type: {
    type: String,
    default: 'mixed',
    validator: (v) => ['mixed', 'code', 'link', 'jingxuan'].includes(v)
  }
})

const getCardType = (index) => {
  if (props.type !== 'mixed') return props.type
  const types = ['code', 'link', 'jingxuan']
  return types[index % 3]
}
</script>

<style scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
}

@media (min-width: 640px) {
  .skeleton-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .skeleton-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

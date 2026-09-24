<template>
  <div class="product-card">
    <div class="product-header">
      <span class="product-icon">{{ product.icon }}</span>
      <span class="product-name">{{ product.name }}</span>
      <span v-if="product.tag" :class="['product-tag', `tag-${product.tagType || 'default'}`]">
        {{ product.tag }}
      </span>
    </div>

    <div class="product-body">
      <p class="product-desc">{{ product.desc }}</p>

      <div v-if="product.price" class="product-price">
        <span class="price-current">¥{{ product.price }}</span>
        <span v-if="product.originalPrice" class="price-original">¥{{ product.originalPrice }}</span>
      </div>

      <div v-if="product.features && product.features.length" class="product-features">
        <span v-for="feature in product.features" :key="feature" class="feature-tag">
          {{ feature }}
        </span>
      </div>
    </div>

    <div class="product-actions">
      <a
        v-if="product.url"
        :href="product.url"
        target="_blank"
        rel="noopener sponsored"
        class="btn btn-primary"
      >
        立即购买
      </a>
      <button v-if="product.coupon" class="btn" @click="handleCopyCoupon">
        领券
      </button>
      <a v-if="product.detailUrl" :href="product.detailUrl" target="_blank" class="btn">
        详情
      </a>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const toast = inject('toast')

async function handleCopyCoupon() {
  if (!props.product.coupon) return
  try {
    await navigator.clipboard.writeText(props.product.coupon)
    toast?.success('优惠券已复制')
  } catch {
    message.error('复制失败')
  }
}
</script>

<style scoped>
.product-card {
  height: 100%;
  transition: all 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.product-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-icon {
  font-size: 20px;
}

.product-name {
  font-weight: 600;
  font-size: 14px;
}

.product-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-desc {
  font-size: 13px;
  color: var(--text-secondary, #666);
  margin: 0;
  line-height: 1.5;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price-current {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary, #ff6b35);
}

.price-original {
  font-size: 13px;
  color: var(--muted, #999);
  text-decoration: line-through;
}

.product-features {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

</style>

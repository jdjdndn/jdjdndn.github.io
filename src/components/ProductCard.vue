<template>
  <n-card class="product-card" :bordered="false" hoverable>
    <template #header>
      <div class="product-header">
        <span class="product-icon">{{ product.icon }}</span>
        <span class="product-name">{{ product.name }}</span>
      </div>
    </template>
    <template #header-extra>
      <n-tag v-if="product.tag" :type="product.tagType || 'default'" size="small">
        {{ product.tag }}
      </n-tag>
    </template>

    <div class="product-body">
      <p class="product-desc">{{ product.desc }}</p>

      <div v-if="product.price" class="product-price">
        <span class="price-current">¥{{ product.price }}</span>
        <span v-if="product.originalPrice" class="price-original">¥{{ product.originalPrice }}</span>
      </div>

      <div v-if="product.features && product.features.length" class="product-features">
        <n-tag v-for="feature in product.features" :key="feature" size="small" type="info">
          {{ feature }}
        </n-tag>
      </div>
    </div>

    <template #action>
      <n-space>
        <n-button
          v-if="product.url"
          type="primary"
          tag="a"
          :href="product.url"
          target="_blank"
          rel="noopener sponsored"
        >
          立即购买
        </n-button>
        <n-button v-if="product.coupon" @click="handleCopyCoupon">
          领券
        </n-button>
        <n-button v-if="product.detailUrl" tag="a" :href="product.detailUrl" target="_blank">
          详情
        </n-button>
      </n-space>
    </template>
  </n-card>
</template>

<script setup>
import { useMessage } from 'naive-ui'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const message = useMessage()

async function handleCopyCoupon() {
  if (!props.product.coupon) return
  try {
    await navigator.clipboard.writeText(props.product.coupon)
    message.success('优惠券已复制')
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

:deep(.n-card__action) {
  padding: 12px 16px;
}
</style>

<template>
  <section class="page-hero" :class="{ 'hero-loaded': isLoaded }">
    <div class="hero-bg">
      <div class="hero-particles" aria-hidden="true"></div>
    </div>

    <div class="hero-content">
      <div class="hero-icon" v-if="icon" v-html="icon" aria-hidden="true"></div>
      <h1 class="hero-title">{{ title }}</h1>
      <p class="hero-subtitle">{{ subtitle }}</p>
      <slot></slot>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  aria: {
    type: String,
    default: ''
  }
})

const isLoaded = ref(false)

onMounted(() => {
  // 延迟添加动画类，确保页面加载后播放动画
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
</script>

<style scoped>
.page-hero {
  position: relative;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.hero-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px),
    radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px, 30px 30px;
  animation: float 20s linear infinite;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50px);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-icon :deep(svg) {
  width: 48px;
  height: 48px;
  fill: white;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin: 0;
  opacity: 0.9;
}

/* 动画 */
.hero-loaded .hero-content {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .page-hero {
    padding: 2rem 1rem;
  }

  .hero-icon {
    width: 60px;
    height: 60px;
  }

  .hero-icon :deep(svg) {
    width: 36px;
    height: 36px;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }
}

/* 小屏 */
@media (max-width: 639px) {
  .page-hero {
    padding: 1.5rem 1rem;
    margin-bottom: 1rem;
    border-radius: 12px;
  }

  .hero-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 0.75rem;
  }

  .hero-icon :deep(svg) {
    width: 28px;
    height: 28px;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 0.875rem;
  }
}
</style>

<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <p>页面未找到</p>
      <p class="description">抱歉，您访问的页面不存在或已被移除。</p>
      <div class="actions">
        <a href="/" class="btn-primary">返回首页</a>
        <button @click="goBack" class="btn-secondary">返回上页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
function goBack() {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    window.location.href = '/'
  }
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  padding: 20px;
}

.not-found-content {
  text-align: center;
  max-width: 400px;
}

.not-found h1 {
  font-size: 120px;
  font-weight: 800;
  color: var(--primary);
  margin: 0;
  line-height: 1;
  opacity: 0.2;
}

.not-found p {
  font-size: 24px;
  font-weight: 600;
  color: var(--text);
  margin: 16px 0 8px;
}

.not-found .description {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 32px;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: var(--hover-bg);
}
</style>

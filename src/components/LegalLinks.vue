<template>
  <footer class="legal-links">
    <div class="legal-content">
      <div class="legal-section">
        <h3>关于我们</h3>
        <ul>
          <li><a href="/about.html">关于券宝</a></li>
          <li><a href="/privacy.html">隐私政策</a></li>
          <li><a href="/qunliao.html">群聊优惠</a></li>
        </ul>
      </div>

      <div class="legal-section">
        <h3>优惠专区</h3>
        <ul>
          <li><a href="/haoka.html">号卡办理</a></li>
          <li><a href="/wifi.html">随身WiFi</a></li>
          <li><a href="/huodong.html">优惠活动</a></li>
        </ul>
      </div>

      <div class="legal-section">
        <h3>更多服务</h3>
        <ul>
          <li><a href="/huiyuan.html">会员优惠</a></li>
          <li><a href="/wangpan.html">网盘资源</a></li>
          <li><a href="/fuye.html">副业赚钱</a></li>
        </ul>
      </div>
    </div>

    <div class="legal-copyright">
      <p>&copy; {{ currentYear }} 券宝 — 优惠券聚合平台</p>
      <p class="legal-disclaimer">
        本站仅为优惠信息聚合平台，不提供任何商品销售或交易服务。
      </p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.legal-links {
  background: var(--bg-elevated, #f5f5f5);
  padding: 2rem 1rem;
  margin-top: 3rem;
  border-top: 1px solid var(--border, #e5e5e5);
}

.legal-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.legal-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--text, #333);
}

.legal-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.legal-section li {
  margin-bottom: 0.5rem;
}

.legal-section a {
  color: var(--text-secondary, #666);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.legal-section a:hover {
  color: var(--primary, #FF6B35);
}

.legal-copyright {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color, #e5e5e5);
}

.legal-copyright p {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary, #666);
}

.legal-disclaimer {
  font-size: 0.75rem;
  opacity: 0.7;
}

/* 响应式 */
@media (max-width: 768px) {
  .legal-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>

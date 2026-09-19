const CACHE_NAME = 'coupon-v4';
const PRECACHE = ['./', './index.html'];

// 安装：预缓存核心文件
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

// 请求拦截：导航请求网络优先，静态资源缓存优先
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  // iframe 外部链接：SWR — 缓存秒开，后台静默更新
  if (e.request.url.includes('kzurl18.cn')) {
    e.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(e.request).then((cached) => {
          const fetched = fetch(e.request).then((res) => {
            if (res && (res.status === 200 || res.type === 'opaque')) {
              cache.put(e.request, res.clone());
            }
            return res;
          }).catch(() => cached);
          return cached || fetched;
        }),
      ),
    );
    return;
  }

  // 导航请求（HTML 页面）：网络优先，失败时回退缓存
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request).then((cached) => cached || caches.match('./index.html'))),
    );
    return;
  }

  // 静态资源（JS/CSS/图片）：缓存优先，无缓存时网络获取
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;

      return fetch(e.request).then((res) => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;

        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        return res;
      });
    }),
  );
});

// 激活：清理旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  );
});

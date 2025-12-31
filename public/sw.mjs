/**
 * Flux Modern Service Worker (ESM)
 * Version: 1.1.0
 */

// Define sw with explicit ServiceWorkerGlobalScope type to access Service Worker specific properties
const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {any} */ (self));

const CACHE_NAME = 'flux-v1.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

// 安装阶段：预缓存核心资产
sw.addEventListener('install', (event) => {
  // Fix: properly cast to any to access ExtendableEvent.waitUntil
  const extendableEvent = /** @type {any} */ (event);
  extendableEvent.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => sw.skipWaiting()) // Fix: accessed via sw which is cast to ServiceWorkerGlobalScope
  );
});

// 激活阶段：清理旧缓存
sw.addEventListener('activate', (event) => {
  // Fix: properly cast to any to access ExtendableEvent.waitUntil
  const extendableEvent = /** @type {any} */ (event);
  extendableEvent.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => sw.clients.claim()) // Fix: accessed via sw which is cast to ServiceWorkerGlobalScope
  );
});

// 拦截请求：Stale-While-Revalidate 策略
sw.addEventListener('fetch', (event) => {
  // Fix: properly cast to any to access FetchEvent.request and respondWith
  const fetchEvent = /** @type {any} */ (event);
  const { request } = fetchEvent;
  const url = new URL(request.url);

  // 1. 忽略非 GET 请求或第三方 API（Mock 数据除外）
  if (request.method !== 'GET') return;
  
  // 2. 针对 CDN 资源（esm.sh, aistudiocdn）使用缓存优先策略
  if (url.hostname.includes('esm.sh') || url.hostname.includes('aistudiocdn.com')) {
    // Fix: access respondWith from casted fetchEvent
    fetchEvent.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        });
      })
    );
    return;
  }

  // 3. 基础同源资源处理
  if (url.origin === sw.location.origin) {
    // Fix: access respondWith from casted fetchEvent
    fetchEvent.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
          }
          return networkResponse;
        }).catch(() => cached); // 网络故障返回缓存

        return cached || fetchPromise;
      })
    );
  }
});

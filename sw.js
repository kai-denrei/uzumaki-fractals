// uzumaki service worker
// Strategies:
//   navigations           → NetworkFirst (3s timeout) + offline fallback
//   same-origin static    → StaleWhileRevalidate
//   cross-origin (fonts)  → CacheFirst

const CACHE = 'uzumaki-v3';

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './noise.svg',
  './cb-badge.js',
  './offline.html',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Strip the cache-bust query for matching but use full URL for fetch
  const url = new URL(req.url);

  // Navigations
  if (req.mode === 'navigate') {
    e.respondWith(navigationStrategy(req));
    return;
  }

  // Same origin
  if (url.origin === self.location.origin) {
    e.respondWith(staleWhileRevalidate(req));
    return;
  }

  // Cross-origin (fonts.googleapis.com, fonts.gstatic.com)
  e.respondWith(cacheFirst(req));
});

async function navigationStrategy(req) {
  try {
    const net = await Promise.race([
      fetch(req),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
    ]);
    if (net && net.ok) {
      const cache = await caches.open(CACHE);
      cache.put(req, net.clone()).catch(() => {});
    }
    return net;
  } catch {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    const fallback = await caches.match('./offline.html');
    if (fallback) return fallback;
    return new Response('offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req, { ignoreSearch: true });
  const network = fetch(req).then(r => {
    if (r && r.ok && (r.type === 'basic' || r.type === 'default')) {
      cache.put(req, r.clone()).catch(() => {});
    }
    return r;
  }).catch(() => null);
  return cached || network || new Response('offline', { status: 503 });
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const net = await fetch(req);
    if (net && net.ok) cache.put(req, net.clone()).catch(() => {});
    return net;
  } catch {
    return new Response('offline', { status: 503 });
  }
}

// Update mechanism: page can postMessage({ type: 'SKIP_WAITING' }) to apply pending SW
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

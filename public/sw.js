/* 八卦 · 入门 — PWA Service Worker v1.1 */
const CACHE = "bagua-v1"

// Auto-detect base path (works on root and subdirectory deployments)
const BASE = self.location.pathname.replace(/\/[^/]+$/, "/")

const PRECACHE_PATHS = [
  ".",
  "eight",
  "hexagrams",
  "divine",
  "flashcard",
  "glossary",
  "simulator",
  "ai-reading",
  "lifegua",
  "compare",
  "contrast",
  "history",
  "relations",
  "binary",
  "fuxi",
  "ten-wings",
  "hetu-luoshu",
  "flying-stars",
  "evolution",
  "yijing-computer",
  "gallery",
  "liuyao",
  "yao-positions",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "icon.svg",
  "favicon.png",
  "apple-touch-icon.png",
]

// Build full URLs relative to SW script location
const PRECACHE_URLS = PRECACHE_PATHS.map((p) => new URL(p, self.location.href).href)

/* On install: pre-cache all known pages & assets */
self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url).catch(() => {})))
    )
  )
})

/* On activate: clean old caches */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

/* On fetch: cache-first for static assets, network-first for dynamic content */
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return
  // Only handle requests under this SW's scope
  if (!url.pathname.startsWith(self.location.pathname.replace(/\/[^/]+$/, "/"))) return

  // For navigation (HTML pages): network-first, fallback to cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match(new URL(".", self.location.href).href))
        )
    )
    return
  }

  // For static assets (JS, CSS, images, fonts): cache-first
  if (/\.(js|css|png|svg|jpg|jpeg|gif|webp|woff2?|ttf|eot|ico)(\?|$)/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy))
          return response
        })
      })
    )
    return
  }

  // Everything else: network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone()
        caches.open(CACHE).then((cache) => cache.put(request, copy))
        return response
      })
      .catch(() => caches.match(request))
  )
})

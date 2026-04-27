const CACHE_NAME = "hellobhaiya-v1"
const APP_SHELL = [
  "/",
  "/dashboard",
  "/test/build",
  "/offline",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Network-first for API and server actions
  if (url.pathname.startsWith("/api/") || request.method !== "GET") {
    event.respondWith(
      fetch(request).catch(() => new Response("Offline", { status: 503 }))
    )
    return
  }

  // Cache-first for app shell
  if (APP_SHELL.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached ?? fetch(request))
    )
    return
  }

  // Cache-first + update for notes PDFs (firebase storage)
  if (url.hostname.includes("firebasestorage")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request)
        if (cached) return cached
        const response = await fetch(request)
        cache.put(request, response.clone())
        return response
      })
    )
    return
  }

  // Default: network with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((r) => r ?? new Response("Offline", { status: 503 })))
  )
})

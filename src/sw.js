const CACHE_NAME = "temp_v1";

const PRECACHE_URLS = ["/"];

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const REQUEST_CACHE_URL = ["dummyjson.com", ".woff2", ".woff"];

const networkFirstAndCache = async (request) => {
  if (
    request.method === "GET" &&
    REQUEST_CACHE_URL.some((e) => request.url.includes(e))
  ) {
    // first try to load response from network and save to cache
    try {
      const responseFromNetwork = await fetch(request.clone());
      putInCache(request, responseFromNetwork.clone());
      console.log("Returned from network", { request });
      return responseFromNetwork;
    } catch {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        console.log("Returned from caching", { request });
        return cachedResponse;
      }

      return new Response("Network error happened", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
      });
    }
  }
  return await fetch(request);
};

self.addEventListener("install", function (event) {
  self.skipWaiting();
  // caching required assets
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  console.log("Service Worker installed");
});

self.addEventListener("activate", function (event) {
  console.log("Service Worker Activated");

  // deleting old active caches
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => cacheName !== CACHE_NAME);
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", async function (event) {
  const { request } = event;
  console.log("Original Request", { request });
  event.respondWith(networkFirstAndCache(request));
});

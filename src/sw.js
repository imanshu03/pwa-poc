const CACHE_NAME = `cache_v${Math.floor(Math.random() * 1000000000000)}`;
` `;
const PRECACHE_URLS = ["/"];

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const ASSETS_REGEX = /\.(html|css|js|woff|woff2|ttf|eot|svg)$/;

const networkFirstAndCache = async (request) => {
  const requestURL = new URL(request.url);
  if (
    request.method === "GET" &&
    self.location.href.includes(requestURL.origin) &&
    ASSETS_REGEX.test(requestURL.pathname)
  ) {
    // first try to load response from network and save to cache
    try {
      const responseFromNetwork = await fetch(request.clone());
      putInCache(request, responseFromNetwork.clone());
      console.log(`Returned from network: ${request.url}`, { request });
      return responseFromNetwork;
    } catch {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        console.log(`Returned from caching: ${request.url}`, { request });
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
  console.log(`Original Request: ${request.url}`, { request });
  event.respondWith(networkFirstAndCache(request));
});

self.addEventListener("push", function (event) {
  const payload = JSON.parse(
    event.data
      ? event.data.text()
      : '{"title":"Dummy Title","body":"Dummy Message"}'
  );
  const options = {
    requireInteraction: true,
    body: payload.body,
    icon: "/icons/cred-196x196.png",
    actions:
      payload.action.title && payload.action.href
        ? [{ action: "view", title: payload.action.title }]
        : undefined,
    data: payload.action?.href ? { url: payload.action.href } : {},
  };
  console.log("SW Push", { payload, options });
  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener("notificationclick", function (event) {
  const payload = event.notification.data;
  if (event.action === "view") {
    clients.openWindow(payload.url || "https://google.com");
  }
});

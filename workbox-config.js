module.exports = {
  globDirectory: "build/",
  globPatterns: ["**/*.{html,js,css,png,jpg,svg,json}"],
  swDest: "build/service-worker.js",
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.destination === "document",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "html-cache",
      },
    },
    {
      urlPattern: ({ request }) => request.destination === "script",
      handler: "CacheFirst",
      options: {
        cacheName: "js-cache",
        expiration: {
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === "style",
      handler: "CacheFirst",
      options: {
        cacheName: "css-cache",
        expiration: {
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === "image",
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
        },
      },
    },
  ],
};

'use strict'

const files = [
  '/',
  'app.css',
  'app.js',
  '../favicon.ico',
  '../favicon.png',
  '../manifest.json',
  '../../assets/alien-monster-192x192.png',
  '../../assets/alien-monster-512x512.png'
]

// eslint-disable-next-line
self.addEventListener('install', event =>
  event
    .waitUntil(caches.open('v1') // eslint-disable-line
      .then(cache => cache.addAll(files)))
)

// eslint-disable-next-line
self.addEventListener('fetch', event => {
  event.respondWith(
    // eslint-disable-next-line
    caches.match(event.request).then(response => {
      if (response !== undefined) return response
      // eslint-disable-next-line
      return fetch(event.request)
        .then(response => {
          const responseClone = response.clone()
          // eslint-disable-next-line
          caches.open('v1').then(cache => {
            return cache.put(event.request, responseClone)
          })
          return response
        })
        .catch(error => {
          throw error
        })
    })
  )
})

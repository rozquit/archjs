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

const registerServiceWorker = () => {
  if (!Reflect.has(navigator, 'serviceWorker')) {
    console.log('Service workers are not supported')
    return
  }
  const { serviceWorker } = navigator
  serviceWorker
    .register('static/build/sw.js')
    .then(registration => {
      if (registration.installing) {
        console.log('Service worker installing')
        console.log(registration.installing)
        return
      }
      if (registration.waiting) {
        console.log('Service worker installed')
        console.log(registration.waiting)
        return
      }
      if (registration.active) {
        console.log('Service worker active')
        console.log(registration.active)
      }
    })
    .catch(error => {
      console.log('Registration failed')
      console.log(error)
    })
}

export const register = () => {
  window.addEventListener('load', () => {
    registerServiceWorker()
  })

  window.addEventListener('beforeinstallprompt', event => {
    console.log('Installing PWA')
    console.dir({ beforeinstallprompt: event })
  })

  window.addEventListener('appinstalled', event => {
    console.log('PWA installed')
    console.dir({ appinstalled: event })
  })
}

export const unregister = () => {
  if ('serviceWorker' in navigator) {
    navigator
      .serviceWorker
      .ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error(error.message)
      })
  }
}

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

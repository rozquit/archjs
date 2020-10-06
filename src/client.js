import App from './client.svelte'

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

window.app = new App({
  target: document.getElementsByTagName('app')[0]
})

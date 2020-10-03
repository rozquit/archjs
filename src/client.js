import App from './client.svelte'

window.app = new App({
  target: document.getElementsByTagName('app')[0]
})

import App from './routes/index.svelte'

window.app = new App({
  target: document.getElementsByTagName('app')[0]
})

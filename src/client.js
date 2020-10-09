import App from './client.svelte'
import * as serviceWorker from './sw'

window.app = new App({
  target: document.getElementsByTagName('app')[0]
})

serviceWorker.register()

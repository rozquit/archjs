import Client from './Client.svelte'
import * as serviceWorker from './sw'

window.app = new Client({
  target: document.getElementsByTagName('app')[0]
})

serviceWorker.register()

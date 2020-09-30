import uWS from 'uWebSockets.js'
import serve from '../utils/serve'
import { PORT } from '../config'

const port = PORT

uWS
  ./* SSL */App({
    key_file_name: 'etc/ssl/key.pem',
    cert_file_name: 'etc/ssl/cert.pem',
    passphrase: 'Oxfords Not Brogues'
  })
  .ws('/*', {
    compression: uWS.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 10,
    open: (ws) => {
      console.log('[archjs]', 'ws connected')
    },
    message: (ws, message, isBinary) => {
      ws.send(message, isBinary)
    },
    drain: (ws) => {
      console.log('[archjs]', `ws backpressure: ${ws.getBufferedAmount()}`)
    },
    close: (ws, code, message) => {
      console.log('[archjs]', 'ws closed')
    }
  })
  .get('/*', serve)
  .listen(port, (token) => {
    if (token) {
      console.log('[archjs] listening to port:', port)
    } else {
      console.log('[archjs] failed to listen to port:', port)
    }
  })

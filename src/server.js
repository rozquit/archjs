import uWS from 'uWebSockets.js'
import serve from '../lib/serve'
import Logger from '../lib/logger'
import { NODE_ENV, PORT } from '../config'

const dev = NODE_ENV === 'development'
const port = PORT
const logger = new Logger().create({ logger: dev })

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
      logger.info('ws connected')
    },
    message: (ws, message, isBinary) => {
      ws.send(message, isBinary)
    },
    drain: (ws) => {
      logger.info(`ws backpressure: ${ws.getBufferedAmount()}`)
    },
    close: (ws, code, message) => {
      logger.info('ws closed')
    }
  })
  .get('/*', serve)
  .listen(port, (token) => {
    if (token) {
      console.log('[arch|uws] listening to port:', port)
    } else {
      console.log('[arch|uws] failed to listen to port:', port)
    }
  })

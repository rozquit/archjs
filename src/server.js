import 'regenerator-runtime/runtime'
import uWS from 'uWebSockets.js'
import { nanoid } from 'nanoid'
import { pg, serve, rpc, Logger } from '../lib'
import { PORT } from '../config'

const dev = process.env.NODE_ENV === 'development'
const logger = new Logger().create({ logger: dev })

pg.connect().catch(error => logger.error(`error: { message: ${error.message} }`))

uWS
  ./* SSL */App({
    key_file_name: 'etc/ssl/key.pem',
    cert_file_name: 'etc/ssl/cert.pem',
    passphrase: 'Oxfords Not Brogues'
  })
  .get('/*', serve)
  .ws('/*', {
    compression: uWS.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 0,
    open: ws => {
      logger.info('ws connected')
      ws.id = nanoid()
      ws.subscribe('broadcast')
    },
    message: rpc,
    drain: ws => logger.info(`ws backpressure: ${ws.getBufferedAmount()}`),
    close: (ws, code, message) => logger.info('ws closed')
  })
  .listen(PORT, (token) => {
    if (token) {
      console.log('[arch|uws] listening to port:', PORT)
    } else {
      console.log('[arch|uws] failed to listen to port:', PORT)
    }
  })

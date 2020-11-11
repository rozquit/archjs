import uWS from 'uWebSockets.js'
import rpc from '../lib/rpc'

const PORT = 9001;


let listenSocket;

exports.shutDownServer = () => {
  console.log('server was shut down');
  uWS.us_listen_socket_close(listenSocket)
  listenSocket = null
}

exports.createServer = options => {
  options = options || {}
  options.port = options.port || PORT
  
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object')
  }
  
  return  uWS./*SSL*/App({
    key_file_name: 'etc/ssl/key.pem',
    cert_file_name: 'etc/ssl/cert.pem',
    passphrase: 'Oxfords Not Brogues'
  })
  .ws('/*', {
    /* Options */
    compression: uWS.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 0,
    /* Handlers */
    open: ws => console.log('ws connected'),
    message: rpc,
    drain: ws => console.log(`ws backpressure: ${ws.getBufferedAmount()}`),
    close: (ws, code, message) => console.log('ws closed')
  })
  .any('/*', (res, req) => res.end('nothing to see here'))
  .listen(options.port, token => {
    listenSocket = token
    if (token) {
      console.log('[arch|test|uws] listening to port:', options.port)
    } else {
      console.log('[arch|test|uws] failed to listen to port:', options.port)
    }
  })
}

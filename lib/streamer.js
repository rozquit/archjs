import Logger from './logger'

const dev = process.env.NODE_ENV === 'development'
const logger = new Logger().create({ logger: dev })

const openStreams = 0

export const toArrayBuffer = buffer => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)

const onAbortedOrFinishedResponse = (res, readStream) => {
  if (res.id === -1) {
    logger.error('ERROR! onAbortedOrFinishedResponse called twice for the same res!')
  } else {
    logger.info(`stream was closed, openStreams: ${openStreams}`)
    readStream.destroy()
  }
  res.id = -1
}

export const pipeStreamOverResponse = (res, readStream, totalSize) => {
  readStream
    .on('data', (chunk) => {
      const ab = toArrayBuffer(chunk)
      const lastOffset = res.getWriteOffset()
      const [ok, done] = res.tryEnd(ab, totalSize)
      if (done) {
        onAbortedOrFinishedResponse(res, readStream)
      } else if (!ok) {
        readStream.pause()
        res.ab = ab
        res.abOffset = lastOffset
        res.onWritable(offset => {
          const [ok, done] = res.tryEnd(res.ab.slice(offset - res.abOffset), totalSize)
          if (done) {
            onAbortedOrFinishedResponse(res, readStream)
          } else if (ok) {
            readStream.resume()
          }
          return ok
        })
      }
    })
    .on('error', () => {
      res.writeStatus('500').end()
      readStream.destroy()
    })
  res.onAborted(() => {
    onAbortedOrFinishedResponse(res, readStream)
  })
}

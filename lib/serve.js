import fs from 'fs'
import { join, extname } from 'path'
import { toArrayBuffer } from './streamer'
import { createLogger } from './logger'
import { NODE_ENV, STATIC } from '../config'

const STATIC_PATH = join(process.cwd(), `./${STATIC}`)
const STATIC_PATH_LENGTH = STATIC_PATH.length

const MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  map: 'application/json',
  json: 'application/json',
  png: 'image/png',
  ico: 'image/x-icon',
  svg: 'image/svg+xml'
}

const dev = NODE_ENV === 'development'
const logger = createLogger({ logger: dev })

const cache = new Map()

const cacheFile = path => {
  const data = fs.readFileSync(path, 'base64')
  const key = path.substring(STATIC_PATH_LENGTH)
  cache.set(key, data)
}

const cacheDirectory = path => {
  const files = fs.readdirSync(path, { withFileTypes: true })
  for (const file of files) {
    const filePath = join(path, file.name)
    if (file.isDirectory()) cacheDirectory(filePath)
    else cacheFile(filePath)
  }
}

cacheDirectory(STATIC_PATH)

export default (res, req) => {
  const reqUrl = req.getUrl()
  const url = reqUrl === '/' ? '/index.html' : reqUrl
  logger.info(`reqUrl: ${url}`)
  const fileExt = extname(url).substring(1)
  const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html
  const data = cache.get(url.replace(new RegExp(`/${STATIC}`), ''))
  res.cork(() => {
    res.writeHeader('content-type', mimeType)
    res.end(toArrayBuffer(Buffer.from(data, 'base64')))
  })
}

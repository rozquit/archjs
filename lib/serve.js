import fs from 'fs'
import { join, extname } from 'path'
import { toArrayBuffer, pipeStreamOverResponse } from './streamer'
import Logger from './logger'
import { NODE_ENV, STATIC } from '../config'

const STATIC_PATH = join(process.cwd(), `./${STATIC}`)
const STATIC_LENGTH = STATIC.length
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
const logger = new Logger().create({ logger: dev })

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

const serveFile = ({ path, mimeType, totalSize }, res) => {
  const readStream = fs.createReadStream(path)
  res.writeHeader('Content-Type', mimeType)
  pipeStreamOverResponse(res, readStream, totalSize)
}

export default (res, req) => {
  const reqUrl = req.getUrl()
  const url = reqUrl === '/' ? `/${STATIC}/index.html` : reqUrl
  const filePath = join(STATIC_PATH, url.substring(STATIC_LENGTH + 1))
  const file = {
    path: filePath,
    mimeType: MIME_TYPES[extname(url).substring(1)] || MIME_TYPES.html,
    totalSize: fs.statSync(filePath).size
  }
  logger.info(`filePath: ${file.path}, fileMimeType: ${file.mimeType}, fileTotalSize: ${file.totalSize}`)
  if (dev) {
    serveFile(file, res)
  } else {
    const cashedFile = cache.get(file.path.substring(STATIC_PATH_LENGTH + 1))
    const data = toArrayBuffer(Buffer.from(cashedFile), 'base64')
    res.cork(() => {
      res.writeHeader('Content-Type', file.mimeType)
      res.end(data)
    })
  }
}

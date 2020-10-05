import fs from 'fs'
import { join, extname } from 'path'
import { toArrayBuffer, pipeStreamOverResponse } from './streamer'
import Logger from './logger'
import { STATIC } from '../config'

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

const dev = process.env.NODE_ENV === 'development'
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

const matchFile = reqUrl => {
  const files = Array.from(cache.keys())
  for (const file of files) {
    if (reqUrl.match(file)) return reqUrl
  }
}

const lookup = reqUrl => {
  const root = '/'
  const fallback = `/${STATIC}/index.html`
  const url = reqUrl === root ? fallback : matchFile(reqUrl) || fallback
  const path = join(STATIC_PATH, url.replace(new RegExp(`/${STATIC}`), ''))
  const mimeType = MIME_TYPES[extname(url).substring(1)] || MIME_TYPES.html
  const totalSize = fs.statSync(path).size
  const arrayBuffer = toArrayBuffer(Buffer.from(cache.get(path.substring(STATIC_PATH_LENGTH)), 'base64'))
  return { path, mimeType, totalSize, arrayBuffer }
}

export default (res, req) => {
  const file = lookup(req.getUrl())
  logger.info(`file: { path: ${file.path}, mimeType: ${file.mimeType}, totalSize: ${file.totalSize} }`)
  if (dev) serveFile(file, res)
  else {
    res.cork(() => {
      res.writeHeader('Content-Type', file.mimeType)
      res.end(file.arrayBuffer)
    })
  }
}

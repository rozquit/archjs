import fs from 'fs'
import { URL } from 'url'
import { join, basename, extname } from 'path'
import { pipeStreamOverResponse } from './streamer'
import { NODE_ENV, HOST, PORT, STATIC } from '../config'

const dev = NODE_ENV === 'development'
const base = `${!dev ? 'https' : 'http'}://${HOST}:${PORT}`

const STATIC_PATH = join(process.cwd(), `./${STATIC}`)

const MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  css: 'text/css',
  svg: 'image/svg+xml',
  png: 'image/png',
  ico: 'image/x-icon',
  js: 'application/javascript; charset=UTF-8',
  map: 'application/json',
  json: 'application/json'
}

const serveFile = name => {
  const filePath = join(STATIC_PATH, name)
  if (!filePath.startsWith(STATIC_PATH)) return null
  return fs.createReadStream(filePath)
}

export default (res, req) => {
  const reqUrl = req.getUrl()
  const urlString = reqUrl === '/' ? 'index.html' : reqUrl
  const { pathname } = new URL(urlString, base)
  const file = basename(pathname)
  const fileExt = extname(file).substring(1)
  const totalSize = fs.statSync(join(STATIC_PATH, file)).size
  console.log('[archjs | serve | file]', [file, totalSize])
  if (MIME_TYPES[fileExt]) {
    const readStream = serveFile(file)
    res.writeHeader('Content-Type', MIME_TYPES[fileExt])
    pipeStreamOverResponse(res, readStream, totalSize)
  } else {
    res.writeStatus('400 Bad Request').end()
  }
}

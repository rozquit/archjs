import fs from 'fs'
import { join, basename } from 'path'
import Ajv from 'ajv'
import {
  requestSchema,
  responseSchema,
  errorSchema
} from './schemas'
import { stringToArrayBuffer, arrayBufferToString } from './utils'
import { SRC, SERVICES } from '../../config'

const SERVICES_PATH = join(process.cwd(), `./${SRC}/${SERVICES}`)

const services = new Map()

const cacheFile = path => {
  const key = basename(path, '.js')
  try {
    const libPath = require.resolve(path)
    delete require.cache[libPath]
  } catch (e) {
    return
  }
  try {
    const method = require(path)
    services.set(key, method)
  } catch (e) {
    services.delete(key)
  }
}

const cacheDirectory = path => {
  const files = fs.readdirSync(path, { withFileTypes: true })
  for (const file of files) {
    const filePath = join(path, file.name)
    if (file.isDirectory()) cacheDirectory(filePath)
    else cacheFile(filePath)
  }
}

cacheDirectory(SERVICES_PATH)

let ajv

const methods = [...services.keys()]

const validate = (schema, data) => {
  if (!ajv) ajv = new Ajv({ allErrors: true })
  const valid = ajv.validate(schema, data)
  if (!valid) throw ajv.errors[0]
}

export const rpcRequest = (id, method, params) => {
  const requestObject = { jsonrpc: '2.0' }
  requestObject.id = id
  requestObject.method = method
  if (params) requestObject.params = params
  validate(requestSchema(methods), requestObject)
  return stringToArrayBuffer(JSON.stringify(requestObject))
}

const rpcResponse = (id, result) => {
  const responseObject = { jsonrpc: '2.0' }
  responseObject.id = id
  responseObject.result = result
  validate(responseSchema, responseObject)
  return stringToArrayBuffer(JSON.stringify(responseObject))
}

const rpcError = (code, message, data) => {
  const errorObject = { jsonrpc: '2.0' }
  errorObject.error = { code, message }
  if (data) errorObject.data = data
  validate(errorSchema, errorObject)
  return stringToArrayBuffer(JSON.stringify(errorObject))
}

export default async (ws, message, isBinary) => {
  try {
    const data = JSON.parse(arrayBufferToString(message))
    validate(requestSchema(methods), data)
    const { method, params, id } = data
    const fn = services.get(method)
    id ? ws.send(rpcResponse(id, await fn(params)), isBinary) : fn(params)
  } catch (err) {
    err.keyword === 'enum'
      ? ws.send(rpcError(-32601, 'Method not found'), isBinary)
      : ws.send(rpcError(-32600, 'Invalid Request', err.message), isBinary)
  }
}

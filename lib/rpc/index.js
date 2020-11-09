'use strict'

const fs = require('fs')
const { join, basename } = require('path')
const EventEmitter = require('events')
const { from, just, empty } = require('most')
const { RpcError } = require('./exceptions')
const {
  requestSchema,
  responseSchema,
  errorSchema
} = require('./schemas')
const {
  arrayBufferToObject,
  objectToArrayBuffer,
  validate
} = require('./utils')
const Logger = require('../logger')
const { SRC, SERVICES } = require('../../config')

const SERVICES_PATH = join(process.cwd(), `./${SRC}/${SERVICES}`)

const dev = process.env.NODE_ENV === 'development'
const logger = new Logger().create({ logger: dev })

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
    const method = require.main.require(path)
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

const methods = [...services.keys()]

exports.rpcRequest = (id, method, params) => {
  const requestObject = { jsonrpc: '2.0' }
  requestObject.method = method
  requestObject.id = id
  if (params) requestObject.params = params
  validate(requestSchema(methods), requestObject)
  return objectToArrayBuffer(requestObject)
}

const rpcResponse = ({ id, result }) => {
  const responseObject = { jsonrpc: '2.0' }
  responseObject.result = result
  if (id) responseObject.id = id
  validate(responseSchema, responseObject)
  return responseObject
}

const rpcError = ({ id, code, message, data = null }) => {
  const errorObject = { jsonrpc: '2.0' }
  errorObject.error = { code, message }
  errorObject.id = id
  if (data) errorObject.data = data
  validate(errorSchema, errorObject)
  return errorObject
}

const validateRequest = validate(requestSchema(methods))

const receiver = new EventEmitter()

const processMessage = ({ ws, message, isBinary }) => {
  const isArray = Array.isArray(message) && message.length > 0

  let result = isArray ? [] : false

  const ifSend = () => (result && !isArray) || result.length > 0

  const responseWithResult = (error, payload) => {
    const response = error ? rpcError(error) : rpcResponse(payload)
    isArray ? result.push(response) : result = response
    return result
  }

  const processMethod = async ({ error = null, data: { method, params, id = null } }) => {
    if (error) {
      logger.error(`error: { message: ${error.message}, code: ${error.code} }`)
      throw new RpcError(error.id, error.code, error.message, error.data || null)
    }

    try {
      const result = await services.get(method)(params)
      return { id, result }
    } catch (e) {
      throw new RpcError(id, -32602, 'Invalid Params', e.message)
    }
  }

  const errorHandler = (error) => {
    responseWithResult(error)
    return empty()
  }

  const fetchErrors = errorHandler => promise => promise.then(just, errorHandler)

  from(isArray ? message : [message])
    .map(validateRequest)
    .map(processMethod)
    .map(fetchErrors(errorHandler))
    .await()
    .join()
    .observe(({ id, result }) => {
      id
        ? responseWithResult(null, { id, result })
        : ws.publish('broadcast', objectToArrayBuffer(rpcResponse({ id: null, result, type: 'broadcast' })), isBinary)
    })
    .then(() => ifSend() ? ws.send(objectToArrayBuffer(result), isBinary) : null)
}

receiver.on('message', processMessage)

const rpc = async (ws, message, isBinary) => receiver.emit('message', { ws, message: arrayBufferToObject(message), isBinary })

module.exports = rpc

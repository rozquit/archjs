import fs from 'fs'
import { join, basename } from 'path'
import EventEmitter from 'events'
import { from } from 'most'
import { RpcError } from './exceptions'
import {
  requestSchema,
  responseSchema,
  errorSchema
} from './schemas'
import {
  objectToArrayBuffer,
  arrayBufferToObject,
  validate
} from './utils'
import Logger from '../logger'
import { SRC, SERVICES } from '../../config'

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

const methods = [...services.keys()]

export const rpcRequest = (id, method, params) => {
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
      logger.error(`Error message: ${error.message}, code: ${error.code}`)
      return Promise.resolve(responseWithResult(error))
    }

    const result = await services.get(method)(params)
      .catch(({ message: data }) => {
        logger.error(`Error message: Invalid Params, code: -32602, data: ${data}`)
        if (id) responseWithResult(new RpcError(id, -32602, 'Invalid Params', data))
      })

    logger.info(`TASK DONE ${JSON.stringify(result)}`)
    id ? responseWithResult(null, { id, result }) : ws.publish('broadcast', objectToArrayBuffer({ ...message, type: 'some type' }), isBinary)
    // if (id) responseWithResult(null, { id, result })
  }

  from(isArray ? message : [message])
    .map(validateRequest)
    .observe(processMethod)
    .then(() => ifSend() ? ws.send(objectToArrayBuffer(result), isBinary) : null)
}

receiver.on('message', processMessage)

export default async (ws, message, isBinary) => receiver.emit('message', { ws, message: arrayBufferToObject(message), isBinary })

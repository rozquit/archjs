'use strict'

import Ajv from 'ajv'
import { RpcError } from '../exceptions'

export const arrayBufferToObject = buffer => JSON.parse(String.fromCharCode.apply(null, new Uint8Array(buffer)))

export const objectToArrayBuffer = object => {
  const string = JSON.stringify(object)
  const buffer = new ArrayBuffer(string.length * 2)
  const bufferView = new Uint8Array(buffer)
  for (let i = 0, stringLength = string.length; i < stringLength; i++) {
    bufferView[i] = string.charCodeAt(i)
  }
  return buffer
}

let ajv

export const validate = schema => data => {
  if (!ajv) ajv = new Ajv({ allErrors: true })
  const valid = ajv.validate(schema, data)
  let error = null
  if (!valid) {
    const { keyword, message, dataPath } = ajv.errors[0]
    const errorMessage = `${dataPath.replace('.', '')} ${message}`.trim()
    switch (keyword) {
      case 'enum':
        error = new RpcError(data.id, -32601, 'Method not found', null, data.id ? 'request' : 'notification')
        break
      default:
        error = new RpcError(data.id, -32600, 'Invalid request', errorMessage)
    }
  }
  return { error, data }
}

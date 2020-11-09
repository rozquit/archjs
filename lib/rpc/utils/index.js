'use strict'

const Ajv = require('ajv')
const { RpcError } = require('../exceptions')

const arrayBufferToObject = buffer => JSON.parse(String.fromCharCode.apply(null, new Uint8Array(buffer)))

const objectToArrayBuffer = object => {
  const string = JSON.stringify(object)
  const buffer = new ArrayBuffer(string.length * 2)
  const bufferView = new Uint8Array(buffer)
  for (let i = 0, stringLength = string.length; i < stringLength; i++) {
    bufferView[i] = string.charCodeAt(i)
  }
  return buffer
}

let ajv

const validate = (schema) => (data) => {
  if (!ajv) ajv = new Ajv({ allErrors: true })
  const valid = ajv.validate(schema, data)
  let error = null
  if (!valid) {
    const { keyword, message, dataPath } = ajv.errors[0]
    console.log(ajv.errors[0])
    const errorMessage = `${dataPath.replace('.', '')} ${message}`.trim()
    switch (keyword) {
      case 'enum':
        console.log(keyword)
        error = new RpcError(data.id, -32601, 'Method not found')
        break
      default:
        error = new RpcError(data.id, -32600, 'Invalid Request', errorMessage)
    }
  }
  return { error, data }
}

module.exports = {
  arrayBufferToObject,
  objectToArrayBuffer,
  validate
}

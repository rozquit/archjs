import Ajv from 'ajv'
import { RpcError } from '../exceptions'

export const arrayBufferToObject = buffer => JSON.parse(String.fromCharCode.apply(null, new Uint8Array(buffer)))

export const objectToArrayBuffer = object => {
  console.log({object})
  const string = JSON.stringify(object)
  const buffer = new ArrayBuffer(string.length * 2)
  const bufferView = new Uint8Array(buffer)
  for (let i = 0, stringLength = string.length; i < stringLength; i++) {
    bufferView[i] = string.charCodeAt(i)
  }
  return buffer
}

let ajv

export const validate = (schema) => (data) => {
  if (!ajv) ajv = new Ajv({ allErrors: true })
  const valid = ajv.validate(schema, data)
  let error = null
  if (!valid) {
    const { keyword, message = null } = ajv.errors[0]
    error = keyword === 'enum' ? new RpcError(data.id, -32601, 'Method not found') : new RpcError(data.id, -32600, 'Invalid Request', message)
  }
  return { error, data }
}

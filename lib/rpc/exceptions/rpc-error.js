export default class RpcError extends Error {
  constructor (id, code, message, data, type) {
    super(message)
    this.name = 'Rpc Error'
    this.id = id || null
    this.code = code
    this.data = data || null
    this.type = type || 'request'
  }
}

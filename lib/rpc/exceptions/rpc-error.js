class RpcError extends Error {
  constructor (id, code, message, data) {
    super(message)
    this.id = id || null
    this.code = code
    this.data = data || null
    this.name = 'Rpc Error'
  }
}

module.exports = RpcError

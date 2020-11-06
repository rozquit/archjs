module.exports = {
  properties: {
    jsonrpc: {
      type: 'string',
      pattern: '2.0'
    },
    error: {
      type: 'object',
      properties: {
        code: { type: 'integer' },
        message: { type: 'string' }
      }
    },
    data: {},
    id: {
      anyOf: [
        { type: 'string' },
        { type: 'integer' },
        { type: 'null' }
      ]
    }
  },
  required: ['jsonrpc', 'error', 'id']
}

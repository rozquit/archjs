module.exports = {
  properties: {
    jsonrpc: {
      type: 'string',
      pattern: '2.0'
    },
    result: {},
    id: {
      anyOf: [
        { type: 'string' },
        { type: 'integer' },
        { type: 'null' }
      ]
    }
  },
  required: ['jsonrpc', 'result', 'id']
}

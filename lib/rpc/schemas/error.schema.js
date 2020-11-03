export default {
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
    data: {}
  },
  required: ['jsonrpc', 'error']
}

const requestSchema = methods => (
  {
    type: 'object',
    properties: {
      jsonrpc: {
        type: 'string',
        pattern: '2.0'
      },
      method: {
        type: 'string',
        enum: methods
      },
      params: {},
      id: {
        anyOf: [
          { type: 'string' },
          { type: 'integer' },
          { type: 'null' }
        ]
      }
    },
    required: ['jsonrpc', 'method']
  }
)

module.exports = requestSchema

const nullLogger = require('abstract-logging')
const pino = require('pino')
const { serializersSym } = pino.symbols

const isValidLogger = logger => {
  if (!logger) return false
  let result = true
  const methods = ['info', 'error', 'debug', 'fatal', 'warn', 'trace', 'child']
  for (let i = 0; i < methods.length; i += 1) {
    if (!logger[methods[i]] || typeof logger[methods[i]] !== 'function') {
      result = false
      break
    }
  }
  return result
}

const createPinoLogger = (opts, stream) => {
  stream = stream || opts.stream
  delete opts.stream
  if (stream && opts.file) {
    throw new Error('Cannot specify both logger.stream and logger.file options')
  } else if (opts.file) {
    stream = pino.destination(opts.file)
    delete opts.file
  }
  const prevLogger = opts.logger
  const prevGenReqId = opts.genReqId
  let logger = null
  if (prevLogger) {
    opts.logger = undefined
    opts.genReqId = undefined
    if (prevLogger[serializersSym]) {
      opts.serializers = Object.assign({}, opts.serializers, prevLogger[serializersSym])
    }
    logger = prevLogger.child(opts)
    opts.logger = prevLogger
    opts.genReqId = prevGenReqId
  } else {
    logger = pino(opts, stream)
  }
  return logger
}

export const createLogger = options => {
  if (isValidLogger(options.logger)) {
    const logger = createPinoLogger({
      logger: options.logger
    })
    return logger
  } else if (!options.logger) {
    const logger = nullLogger
    logger.child = () => logger
    return logger
  } else {
    const localLoggerOptions = {}
    if (Object.prototype.toString.call(options.logger) === '[object Object]') {
      Reflect.ownKeys(options.logger).forEach(prop => {
        Object.defineProperty(localLoggerOptions, prop, {
          value: options.logger[prop],
          writable: true,
          enumerable: true,
          configurable: true
        })
      })
    }
    localLoggerOptions.level = localLoggerOptions.level || 'info'
    options.logger = localLoggerOptions
    return createPinoLogger(options.logger)
  }
}

'use strict'

const testError = async args => {
  await new Promise(resolve => setTimeout(resolve, 500))
  throw new Error('test async error')
}

module.exports = testError

'use strict'

const testAsync = async args => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return args
}

module.exports = testAsync

'use strict'

const { Pool } = require('pg')
const {
  PG_USER: user,
  PG_PASSWORD: password,
  PG_HOST: host,
  PG_DATABASE: database,
  PG_PORT: port
} = require('../config')

const pool = new Pool({ user, password, host, database, port })

const connect = async () => {
  const client = await pool.connect()
  client.release()
  return true
}

const close = (done) => pool.end(done)

module.exports = {
  connect,
  close,
  pool
}

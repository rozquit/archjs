const { Pool } = require('pg')
const {
  PG_PORT: port,
  PG_PASSWORD: password,
  PG_DATABASE: database,
  PG_USER: user,
  PG_HOST: host
} = require('../config')

const pool = new Pool({ user, password, host, database, port })

const connect = async () => {
  const client = await pool.connect()
  client.release()
  return true
}

const close = (done) => pool.end(done)

const pg = {
  connect,
  close,
  pool
}

module.exports = pg

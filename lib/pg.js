import { Pool } from 'pg'

let pool = null

const connect = async options => {
  pool = new Pool(options)
  const client = await pool.connect()
  client.release()
  return true
}

const close = (fastify, done) => pool.end(done)

const pg = {
  connect,
  close,
  pool
}

export default pg

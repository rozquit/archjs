'use strict'

import { Pool } from 'pg'
import {
  PG_USER as user,
  PG_PASSWORD as password,
  PG_HOST as host,
  PG_DATABASE as database,
  PG_PORT as port
} from '../config'

const pool = new Pool({ user, password, host, database, port })

const connect = async () => {
  const client = await pool.connect()
  client.release()
  return true
}

const close = done => pool.end(done)

export {
  connect,
  close,
  pool
}

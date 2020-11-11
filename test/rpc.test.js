import { createServer, shutDownServer } from './test-server'

const port = 9001
const url = `ws://localhost:${port}`

beforeAll(done => {
  createServer({ port })
  done()
})

afterAll(done => {
  shutDownServer()
  done()
})

describe('json-rpc-2.0', () => {
  test('rpc call with positional parameters', done => {
    expect.assertions(1)

    const testCase = { jsonrpc: '2.0', method: 'echo', params: [42, 23], id: 1 }
    const expected = { jsonrpc: '2.0', result: [42, 23], id: 1 }
    
    const ws = new WebSocket(url)
    
    ws.addEventListener('open', () => ws.send(JSON.stringify(testCase)))
    
    ws.addEventListener('message', event => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    
    ws.addEventListener('close', () => done())
  })
  
  test('rpc call with named parameters', done => {
    expect.assertions(1)
    
    const testCase = { jsonrpc: '2.0', method: 'echo', params: { foo: 23, bar: 42 }, id: 1 }
    const expected = { jsonrpc: '2.0', result: { foo: 23, bar: 42 }, id: 1 }
    
    const ws = new WebSocket(url)
    
    ws.addEventListener('open', () => ws.send(JSON.stringify(testCase)))
    
    ws.addEventListener('message', event => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    
    ws.addEventListener('close', () => done())
  })

  test('notification call with parameters', done => {
    const testCase = { jsonrpc: '2.0', method: 'echo', params: [1, 2, 3, 4, 5] }
    
    const ws = new WebSocket(url)
    
    ws.addEventListener('open', () => ws.send(JSON.stringify(testCase)))
    
    ws.addEventListener('message', () => {
      done.fail('SHOULD NOT BE ANY MESSAGES')
      ws.close()
    })
    
    setTimeout(() => ws.close(), 2000)
    
    ws.addEventListener('close', () => done())
  })
  
  test('notification call without parameters', done => {
    const testCase = { jsonrpc: '2.0', method: 'echo' }
    
    const ws = new WebSocket(url)
    
    ws.addEventListener('open', () => ws.send(JSON.stringify(testCase)))
    
    ws.addEventListener('message', () => {
      done.fail('SHOULD NOT BE ANY MESSAGES')
      ws.close()
    })
    
    setTimeout(() => ws.close(), 2000)
    
    ws.addEventListener('close', () => done())
  })
  
  // TODO: Fix
  test('notification call of non-existent method', done => {
    const testCase = { jsonrpc: '2.0', method: 'foobar', params: [42, 23] }
    
    const ws = new WebSocket(url)
    
    ws.addEventListener('open', () => ws.send(JSON.stringify(testCase)))
    
    ws.addEventListener('message', () => {
      done.fail('SHOULD NOT BE ANY MESSAGES')
      ws.close()
    })
  
    setTimeout(() => ws.close(), 2000)
    
    ws.addEventListener('close', () => done())
  })

  test('rpc call of non-existent method', done => {
    expect.assertions(1)
    
    const testCase = { jsonrpc: '2.0', method: 'foobar', id: 1 }
    const expected = { jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' }, id: 1 }
    
    const ws = new WebSocket(url)
   
    ws.addEventListener('open', () => ws.send(JSON.stringify(testCase)))
    
    ws.addEventListener('message', event => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    
    ws.addEventListener('close', () => done())
  })
  
  test('rpc call with invalid JSON', done => {
    expect.assertions(1)
    
    const testCase = `{"jsonrpc": "2.0", "method": "foobar, "params": "bar", "baz]`
    const expected = { jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' }, id: null }
    
    const ws = new WebSocket(url)
    
    ws.addEventListener('open', () => ws.send(testCase))
    
    ws.addEventListener('message', event => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    
    ws.addEventListener('close', () => done())
  })

  test('rpc call with invalid Request object', done => {
    expect.assertions(1)
    
    const testCase = { jsonrpc: '2.0', method: 1, params: 'foo' }
    const expected = { jsonrpc : '2.0', error: { code: -32600, message: 'Invalid request' }, id: null, data: 'method should be string' }
    
    const ws = new WebSocket(url)
    
    ws.addEventListener('open', () => ws.send(JSON.stringify(testCase)))
    
    ws.addEventListener('message', event => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    
    ws.addEventListener('close', () => done())
  })

  test('rpc call Batch, invalid JSON', done => {
    expect.assertions(1)
    
    const testCase = `[
      {"jsonrpc": "2.0", "method": "echo", "params": [1, 2, 4], "id": "1"},
      {"jsonrpc": "2.0", "method"
    ]`
    const expected = { jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' }, id: null }
    
    const ws = new WebSocket(url)
    
    ws.addEventListener('open', () => ws.send(testCase))
    
    ws.addEventListener('message', event => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    
    ws.addEventListener('close', () => done())
  })

  test('rpc call with an empty Array', done => {
    expect.assertions(1)
    
    const testCase = []
    const expected = { jsonrpc: '2.0', error: { code: -32600, message: 'Invalid request' }, id: null, data: 'should be object' }
    
    const ws = new WebSocket(url)
    
    ws.addEventListener('open', () => ws.send(JSON.stringify(testCase)))
    
    ws.addEventListener('message', event => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    
    ws.addEventListener('close', () => done())
  })

  test('rpc call with an invalid Batch (but not empty)', done => {
    expect.assertions(1)
    
    const testCase = [1]
    const expected = [{ jsonrpc: '2.0', error: { code: -32600, message: 'Invalid request' }, id: null, data: 'should be object' }]
    
    const ws = new WebSocket(url)
    
    ws.addEventListener('open', () => ws.send(JSON.stringify(testCase)))
    
    ws.addEventListener('message', event => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    
    ws.addEventListener('close', () => done())
  })

  test('rpc call with invalid Batch', done => {
    expect.assertions(1)
    
    const testCase = [1, 2, 3]
    const expected = [
      { jsonrpc: '2.0', error: { code: -32600, message: 'Invalid request' }, id: null, data: 'should be object' },
      { jsonrpc: '2.0', error: { code: -32600, message: 'Invalid request' }, id: null, data: 'should be object' },
      { jsonrpc: '2.0', error: { code: -32600, message: 'Invalid request' }, id: null, data: 'should be object' }
    ]
    
    const ws = new WebSocket(url)
    
    ws.addEventListener('open', () => ws.send(JSON.stringify(testCase)))
    
    ws.addEventListener('message', event => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    
    ws.addEventListener('close', () => done())
  })

  test('rpc call Batch', done => {
    expect.assertions(1)
    
    const testCase = [
      { jsonrpc: '2.0', method: 'echo', params: [1, 2, 4], id: '1'},
      { jsonrpc: '2.0', method: 'echo', params: [7] },
      { jsonrpc: '2.0', method: 'testAsync', params: [42, 23], id: '2' },
      { foo: 'bar' },
      { jsonrpc: '2.0', method: 'echo.get', params: { name: 'myself' }, id: '5'},
      { jsonrpc: '2.0', method: 'testError', id: '9' },
      { jsonrpc: '2.0', method: 'foobar', params: [42, 23] },
    ]
    const expected = [
      { jsonrpc: '2.0', error: { code: -32600, message: 'Invalid request' }, id: null, data: `should have required property 'jsonrpc'` },
      { jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' }, id: '5' },
      { jsonrpc: '2.0', result: [1, 2, 4], id: '1' },
      { jsonrpc: '2.0', result: [42, 23], id: '2' },
      { jsonrpc: '2.0', error: { code: -32602, message: 'Invalid params' }, id: '9', data: 'test async error' }
    ]
    
    const ws = new WebSocket(url)
    
    ws.addEventListener('open', () => ws.send(JSON.stringify(testCase)))
    
    ws.addEventListener('message', event => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    
    ws.addEventListener('close', () => done())
  })

  test('rpc call Batch (all notifications)', done => {
    const testCase = [
      { jsonrpc: '2.0', method: 'testAsync', params: [1, 2, 4] },
      { jsonrpc: '2.0', method: 'testAsync', params: [7] },
      { jsonrpc: '2.0', method: 'foobar', params: [42, 23] },
    ]
    
    const ws = new WebSocket(url)
    
    ws.addEventListener('open', () => ws.send(JSON.stringify(testCase)))
    
    ws.addEventListener('message', () => {
      done.fail('SHOULD NOT BE ANY MESSAGES')
      ws.close()
    })
    
    setTimeout(() => ws.close(), 2000)
    
    ws.addEventListener('close', () => done())
  })
})

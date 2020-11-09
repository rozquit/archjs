describe('rpc-ws', () => {
  test('single request call', (done) => {
    expect.assertions(1)

    const testCase = {"jsonrpc": "2.0", "method": "echo", "params": [42, 23], "id": 1}
    const expected = {"jsonrpc": "2.0", "result": [42, 23], "id": 1}
    const ws = new WebSocket('ws://localhost:3939')
    ws.addEventListener('open', (event) => {
      ws.send(JSON.stringify(testCase))
    })
    ws.addEventListener('message', (event) => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    ws.addEventListener('close', () => done())
  })

  test('notification', (done) => {
    const testCase = {"jsonrpc": "2.0", "method": "echo", "params": [42, 23]}
    const ws = new WebSocket('ws://localhost:3939')
    ws.addEventListener('open', (event) => {
      ws.send(JSON.stringify(testCase))
    })
    ws.addEventListener('message', (event) => {
      done.fail('SHOULD NOT BE ANY MESSAGES')
      ws.close()
    })
    setTimeout(() => {
      ws.close()
    }, 2000)
    ws.addEventListener('close', () => done())
  })

  test('non-existent method with id', (done) => {
    expect.assertions(1)
    const testCase = {"jsonrpc": "2.0", "method": "none", "params": [42, 23], "id": 1}
    const expected = {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": 1}
    const ws = new WebSocket('ws://localhost:3939')
    ws.addEventListener('open', (event) => {
      ws.send(JSON.stringify(testCase))
    })
    ws.addEventListener('message', (event) => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    ws.addEventListener('close', () => done())
  })

  test('non-existent method without id', (done) => {
    expect.assertions(1)
    const testCase = {"jsonrpc": "2.0", "method": "none", "params": [42, 23]}
    const expected = {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": null}
    const ws = new WebSocket('ws://localhost:3939')
    ws.addEventListener('open', (event) => {
      ws.send(JSON.stringify(testCase))
    })
    ws.addEventListener('message', (event) => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    ws.addEventListener('close', () => done())
  })

  test('invalid request call', (done) => {
    expect.assertions(1)
    const testCase = {"jsonrpc": "2.0", "method": 1, "params": "bar"}
    const expected = {"jsonrpc": "2.0", "error": {"code":-32600,"message":"Invalid Request"}, "id": null, "data":"method should be string"}
    const ws = new WebSocket('ws://localhost:3939')
    ws.addEventListener('open', (event) => {
      ws.send(JSON.stringify(testCase))
    })
    ws.addEventListener('message', (event) => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    ws.addEventListener('close', () => done())
  })

  test('invalid json call', (done) => {
    expect.assertions(1)
    const testCase = '{"jsonrpc": "2.0" "method"'
    const expected = {"jsonrpc": "2.0", "error":{"code":-32700,"message":"Parse error"}, "id": null}
    const ws = new WebSocket('ws://localhost:3939')
    ws.addEventListener('open', (event) => {
      ws.send(testCase)
    })
    ws.addEventListener('message', (event) => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    ws.addEventListener('close', () => done())
  })

  test('invalid batch json call', (done) => {
    expect.assertions(1)
    const testCase = `[
      {"jsonrpc": "2.0", "method": "sum", "params": [1,2,4], "id": "1"},
      {"jsonrpc": "2.0", "method"
    ]`
    const expected = {"jsonrpc": "2.0", "error": {"code":-32700,"message":"Parse error"}, "id": null}
    const ws = new WebSocket('ws://localhost:3939')
    ws.addEventListener('open', (event) => {
      ws.send(testCase)
    })
    ws.addEventListener('message', (event) => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    ws.addEventListener('close', () => done())
  })

  test('empty array call', (done) => {
    expect.assertions(1)
    const testCase = []
    const expected = {"jsonrpc": "2.0", "error": {"code":-32600,"message":"Invalid Request"}, "id": null, "data":"should be object"}
    const ws = new WebSocket('ws://localhost:3939')
    ws.addEventListener('open', (event) => {
      ws.send(JSON.stringify(testCase))
    })
    ws.addEventListener('message', (event) => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    ws.addEventListener('close', () => done())
  })

  test('rpc call with an invalid Batch (but not empty)', (done) => {
    expect.assertions(1)
    const testCase = [1]
    const expected = [{"jsonrpc": "2.0", "error": {"code":-32600,"message":"Invalid Request"}, "id": null, "data":"should be object"}]
    const ws = new WebSocket('ws://localhost:3939')
    ws.addEventListener('open', (event) => {
      ws.send(JSON.stringify(testCase))
    })
    ws.addEventListener('message', (event) => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    ws.addEventListener('close', () => done())
  })

  test('rpc call with invalid Batch', (done) => {
    expect.assertions(1)
    const testCase = [1,2,3]
    const expected = [
      {"jsonrpc": "2.0", "error": {"code":-32600,"message":"Invalid Request"}, "id": null, "data":"should be object"},
      {"jsonrpc": "2.0", "error": {"code":-32600,"message":"Invalid Request"}, "id": null, "data":"should be object"},
      {"jsonrpc": "2.0", "error": {"code":-32600,"message":"Invalid Request"}, "id": null, "data":"should be object"}
      ]
    const ws = new WebSocket('ws://localhost:3939')
    ws.addEventListener('open', (event) => {
      ws.send(JSON.stringify(testCase))
    })
    ws.addEventListener('message', (event) => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    ws.addEventListener('close', () => done())
  })

  test('rpc call Batch', (done) => {
    expect.assertions(1)
    const testCase = [
      {"jsonrpc": "2.0", "method": "echo", "params": [1,2,4], "id": "1"},
      {"jsonrpc": "2.0", "method": "echo", "params": [7]},
      {"jsonrpc": "2.0", "method": "testAsync", "params": [42,23], "id": "2"},
      {"foo": "boo"},
      {"jsonrpc": "2.0", "method": "foo.get", "params": {"name": "myself"}, "id": "5"},
      {"jsonrpc": "2.0", "method": "testError", "id": "9"}
    ]
    const expected = [
      {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null, "data":"should have required property 'jsonrpc'"},
      {"jsonrpc":"2.0","error":{"code":-32601,"message":"Method not found"},"id":"5"},
      {"jsonrpc": "2.0", "result": [1,2,4], "id": "1"},
      {"jsonrpc": "2.0", "result": [42,23], "id": "2"},
      {"jsonrpc":"2.0","error":{"code":-32602,"message":"Invalid Params"},"id":"9","data":"test async error"}
    ]
    const ws = new WebSocket('ws://localhost:3939')
    ws.addEventListener('open', (event) => {
      ws.send(JSON.stringify(testCase))
    })
    ws.addEventListener('message', (event) => {
      expect(JSON.parse(event.data)).toEqual(expected)
      ws.close()
    })
    ws.addEventListener('close', () => done())
  })

  test('batch notifications', (done) => {
    const testCase = [
      {"jsonrpc": "2.0", "method": "testAsync", "params": [1,2,4]},
      {"jsonrpc": "2.0", "method": "testAsync", "params": [7]}
    ]
    const ws = new WebSocket('ws://localhost:3939')
    ws.addEventListener('open', (event) => {
      ws.send(JSON.stringify(testCase))
    })
    ws.addEventListener('message', (event) => {
      done.fail('SHOULD NOT BE ANY MESSAGES')
      ws.close()
    })
    setTimeout(() => {
      ws.close()
    }, 2000)
    ws.addEventListener('close', () => done())
  })
})

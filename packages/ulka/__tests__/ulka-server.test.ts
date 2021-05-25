import fetch from 'node-fetch'
import { UlkaServer } from '../src/UlkaServer'

// @ts-ignore
let server: UlkaServer
beforeAll(() => {
  server = new UlkaServer(__dirname, 3426)
})

describe('ulka:ulka-server', () => {
  test('ulka-server:findport should not change anything if port is available', async () => {
    await server.findPort()
    expect(server.port).toBe(3426)
  })

  test('ulka-server should have prop prop as provided to create instance', () => {
    expect(server.base).toBe(__dirname)
    expect(server.port).toBe(3426)
  })

  test('ulka-server:log should call console.log', () => {
    const spy = jest.spyOn(console, 'log')
    spy.mockImplementation(() => {})
    server.log()

    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })

  test('ulka-server:wss send, reloadcss, reload should not throw any error', () => {
    expect(() => server.wss.reload()).not.toThrowError()
    expect(() => server.wss.reloadCss()).not.toThrowError()
    expect(() => server.wss.send('hi')).not.toThrowError()
  })

  test('ulka:listen should start the server', (done) => {
    server.listen(() => {
      fetch(`http://localhost:${server.port}/`).then((res) => {
        expect(res.statusText).toBe('Not Found')
        server.server.close(() => done())
      })
    })
  })

  test('ulka:listen should serve the files', (done) => {
    server.listen(() => {
      fetch(`http://localhost:${server.port}/index.test.ts`).then((res) => {
        expect(res.statusText).not.toBe('Not Found')
        server.server.close(() => done())
      })
    })
  })
})

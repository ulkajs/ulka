import path from 'path'
import fetch from 'node-fetch'
import { UlkaServer } from '../src/UlkaServer'

const cwd = path.join(__dirname, 'e2e', 'resources', 'basic')
// @ts-ignore
let server: UlkaServer
beforeAll(() => {
  server = new UlkaServer(cwd, 3426)
})

describe('ulka:ulka-server', () => {
  test('ulka-server:findport should not change anything if port is available', async () => {
    await server.findPort()
    expect(server.port).toBe(3426)
  })

  test('ulka-server should have prop prop as provided to create instance', () => {
    expect(server.base).toBe(cwd)
    expect(server.port).toBe(3426)
  })

  test('ulka-server:log should call console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {})
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
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {})

    const callback = async () => {
      const res = await fetch(`http://localhost:${server.port}`)
      const res2 = await fetch(`http://localhost:${server.port}/ulka-config.js`)

      expect(res2.statusText).not.toBe('Not Found')

      expect(res.statusText).toBe('Not Found')
      expect((await res.text()).trim()).toBe(`This is 404`)
      server.server.close(() => {
        done()
        spy.mockRestore()
      })
    }

    server.listen(callback)
  })
})

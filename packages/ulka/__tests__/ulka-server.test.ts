import fetch from 'node-fetch'
import { UlkaServer } from '../src/UlkaServer'

// @ts-ignore
let instance: UlkaServer
beforeAll(() => {
  instance = new UlkaServer(__dirname, 3426)
})

describe('ulka:ulka-server', () => {
  test('ulka-server:findport should not change anything if port is available', async () => {
    await instance.findPort()
    expect(instance.port).toBe(3426)
  })

  test('ulka-server should have prop prop as provided to create instance', () => {
    expect(instance.base).toBe(__dirname)
    expect(instance.port).toBe(3426)
  })

  test('ulka-server:log should call console.log', () => {
    const spy = jest.spyOn(console, 'log')
    spy.mockImplementation(() => {})
    instance.log()

    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })

  test('ulka-server:wss send, reloadcss, reload should not throw any error', () => {
    expect(() => instance.wss.reload()).not.toThrowError()
    expect(() => instance.wss.reloadCss()).not.toThrowError()
    expect(() => instance.wss.send('hi')).not.toThrowError()
  })

  test('ulka:listen should start the server', (done) => {
    instance.listen(() => {
      fetch(`http://localhost:${instance.port}/`).then((res) => {
        expect(res.statusText).toBe('Not Found')
        instance.server.close(() => done())
      })
    })
  })

  test('ulka:listen should serve the files', (done) => {
    instance.listen(() => {
      fetch(`http://localhost:${instance.port}/index.test.ts`).then((res) => {
        expect(res.statusText).not.toBe('Not Found')
        instance.server.close(() => done())
      })
    })
  })
})

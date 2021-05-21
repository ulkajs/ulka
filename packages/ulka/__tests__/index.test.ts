import * as exportedObjects from '../src/index'
import { setup, Ulka, UlkaError } from '../src/index'

describe('ulka:index', () => {
  test('index:setup should have all the exported all required funcs/vars', () => {
    expect(exportedObjects).toMatchInlineSnapshot(`
      Object {
        "Collection": [Function],
        "EjsTemplate": [Function],
        "FileInfo": [Function],
        "LiquidTemplate": [Function],
        "MdTemplate": [Function],
        "Template": [Function],
        "Ulka": [Function],
        "UlkaError": [Function],
        "UlkaServer": [Function],
        "UlkaTemplate": [Function],
        "box": [Function],
        "build": [Function],
        "clearConsole": [Function],
        "defineConfig": [Function],
        "resolvePlugin": [Function],
        "setup": [Function],
        "watch": [Function],
      }
    `)
  })

  test('index:setup should return instanceof ulka', async () => {
    expect((await setup(process.cwd(), '', '')) instanceof Ulka).toBe(true)
  })

  test('index:UlkaError should have message and custom property', () => {
    const error = new UlkaError('Invalid', '> Invalid')
    expect(error.message).toBe('Invalid')
    expect(error.custom).toBe('> Invalid')
  })
})

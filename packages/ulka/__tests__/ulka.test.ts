import { Ulka } from '../src/Ulka'
import { emptyPlugins } from '../src/utils'

// @ts-ignore
let ulka: Ulka
beforeAll(() => {
  ulka = new Ulka(__dirname, 'build', '')
})

describe('ulka:ulka', () => {
  beforeEach(() => {
    ulka.reset()
  })

  test('ulka:collections should be empty at first', () => {
    expect(ulka.collections).toEqual({})
  })

  test('ulka:plugins should be empty at first', () => {
    expect(ulka.plugins).toEqual(emptyPlugins())
  })

  test('ulka:task should be as provided during instance creating', () => {
    expect(ulka.task).toBe('build')
  })
})

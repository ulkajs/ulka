import { Template, FileInfo, Ulka } from '../src'

describe('ulka:template', () => {
  test('clone method should work', async () => {
    const finfo = new FileInfo(__filename)
    const ulka = await Ulka.init(__dirname, 'build', '')
    const template = new Template(ulka, finfo)
    expect(template.clone()).not.toBe(template)
  })

  test('matter should be empty object if hasMatter is false', async () => {
    const finfo = new FileInfo(__filename)
    const ulka = await Ulka.init(__dirname, 'build', '')

    class A extends Template {
      get hasMatter() {
        return false
      }
    }

    const template = new A(ulka, finfo).readMatter()

    expect(template.context.matter).toEqual({})
  })

  test('content should be string if contentShouldBeString is true', async () => {
    const finfo = new FileInfo(__filename)
    const ulka = await Ulka.init(__dirname, 'build', '')

    class A extends Template {
      get hasMatter() {
        return false
      }

      get contentShouldBeString() {
        return true
      }
    }

    expect(typeof new A(ulka, finfo).readMatter().content).toBe('string')
  })
})

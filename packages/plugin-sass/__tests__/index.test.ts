import fs from 'fs'
import path from 'path'
import plugin from '../src'
import rimraf from 'rimraf'

import { build, Ulka } from 'ulka'

const cwd = path.join(__dirname, 'resource')

beforeAll(async () => {
  const ulka = new Ulka(cwd, 'build', 'ulka-config.js')

  const p = plugin({ sourceMap: true, omitSourceMapUrl: true })
  ulka.plugins.afterSetup.push(p.afterSetup)

  ulka.setup()
  await build(ulka)
})

afterAll(() => {
  rimraf.sync(path.join(cwd, '_site'))
})

describe('plugin:sass - style.css', () => {
  test('should have built style.css and map file', () => {
    expect(fs.existsSync(path.join(cwd, '_site', 'style.css'))).toBe(true)
    expect(fs.existsSync(path.join(cwd, '_site', 'style.css.map'))).toBe(true)
  })

  test('should have build proper css', () => {
    expect(fs.readFileSync(path.join(cwd, '_site', 'style.css'), 'utf-8'))
      .toMatchInlineSnapshot(`
      "div {
        width: 20px;
      }

      p {
        color: crimson;
      }"
    `)
  })
})

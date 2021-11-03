import path from 'path'
import plugin from '../src'
import rimraf from 'rimraf'

import { build, setup } from 'ulka'

const cwd = path.join(__dirname, 'resource')

beforeAll(async () => {
  const ulka = await setup(cwd, 'build', 'ulka-config.js')

  const p = plugin()
  ulka.plugins.afterCreateContext.push(p.afterCreateContext)
  ulka.plugins.afterBuild.push(p.afterBuild)

  await build(ulka)
})

afterAll(() => {
  rimraf.sync(path.join(cwd, '_site'))
})

describe('plugin:tags - context.tags', () => {
  test('should have expected tags', () => {
    expect(require(path.join(cwd, '_site', 'tags.json')))
      .toMatchInlineSnapshot(`
      Object {
        "data1": Array [
          Object {
            "link": "/blogs/data/",
            "matter": Object {
              "tags": Array [
                "data1",
                "data2",
              ],
            },
          },
          Object {
            "link": "/blogs/",
            "matter": Object {
              "tags": Array [
                "data1",
              ],
            },
          },
        ],
        "data2": Array [
          Object {
            "link": "/blogs/data/",
            "matter": Object {
              "tags": Array [
                "data1",
                "data2",
              ],
            },
          },
        ],
      }
    `)
  })
})

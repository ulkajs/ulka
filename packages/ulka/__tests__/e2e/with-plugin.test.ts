import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import cheerio, { CheerioAPI } from 'cheerio'

import { build, setup } from '../../src'

const cwd = path.join(__dirname, 'resources', 'with-plugin')

beforeAll(async () => {
  const ulka = await setup(cwd, 'build', 'ulka-config.js')
  // @ts-ignore
  await build(ulka)
})

afterAll(() => {
  rimraf.sync(path.join(cwd, '_site'))
})

describe('e2e:basic - index.html', () => {
  // @ts-ignore
  let $: CheerioAPI

  beforeAll(() => {
    const html = fs.readFileSync(path.join(cwd, '_site', 'index.html'), 'utf-8')
    $ = cheerio.load(html)
  })

  describe('added plugin should work', () => {
    test('should have text added by beforeRender plugin', () => {
      expect($('.reading-time').text()).toBe('random-text')
    })

    test('should have text added by afterSetup && beforeRender plugin', () => {
      expect($('.after-setup').text()).toBe('done')
    })
  })

  test('other files should be copied', () => {
    expect(fs.existsSync(path.join(cwd, '_site', 'style.css'))).toBe(true)
  })
})
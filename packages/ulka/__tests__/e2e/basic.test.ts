import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import readdir from 'recursive-readdir'
import cheerio, { CheerioAPI } from 'cheerio'

import { build, setup } from '../../src'

const cwd = path.join(__dirname, 'resources', 'basic')

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

  describe('layout should work', () => {
    test('should have proper title', () => {
      expect($('title').text()).toBe('Home Page')
    })

    test('links should have all stylesheets', () => {
      const links: any[] = []
      $('link').each((_, el) => {
        links.push($(el).attr('href'))
      })

      expect(links).toEqual([
        'css-file-that-doesnt-exist.css',
        'css-file-that-doesnt-exist2.css',
      ])
    })

    test('body should have content', () => {
      expect($('body').text().trim()).not.toBe('')
    })
  })

  describe('collections should work', () => {
    test('should have all the blogs links in index.html file', () => {
      const links: any[] = []
      $('a').each((_, el) => {
        links.push($(el).attr('href'))
      })

      expect(links).toEqual(['/blogs/post-1/'])
    })
  })

  test('all files should be built', async () => {
    const files = (await readdir(path.join(cwd, '_site'))).map((p) =>
      path.relative(path.join(cwd, '_site'), p).split(path.sep).join('/')
    )

    expect(files.sort()).toEqual(
      [
        'index.html',
        'custom/path/index.html',
        'blogs/post-1/index.html',
        'copy-this-file-2.css',
        'copy-this-file.css',
      ].sort()
    )
  })
})

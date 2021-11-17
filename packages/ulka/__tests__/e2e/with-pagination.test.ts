import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import cheerio from 'cheerio'
import readdir from 'recursive-readdir'

import { build, setup } from '../../src'

const cwd = path.join(__dirname, 'resources', 'with-pagination')

beforeAll(async () => {
  const ulka = await setup(cwd, 'build', 'ulka-config.js')
  await build(ulka)
})

afterAll(() => {
  rimraf.sync(path.join(cwd, '_site'))
})

describe('e2e:with-pagination', () => {
  describe('pagination of blogs.liquid should work', () => {
    test('two pages should be build', async () => {
      const all = await readdir(path.join(cwd, '_site', 'blogs'))
      const pages = all.filter((a) => a.match(/page-[0-9]/))
      expect(pages.length).toBe(2)
    })

    test('each page should have correct titles', async () => {
      const titles = (await readdir(path.join(cwd, '_site', 'blogs')))
        .filter((a) => a.match(/page-[0-9]/))
        .sort()
        .map((a) => cheerio.load(fs.readFileSync(a, 'utf-8')))
        .map(($) =>
          $('h1')
            .toArray()
            .map((a) => $(a).text())
        )

      expect(titles).toEqual([['Post-1', 'Post-2'], ['Post-3']])
    })
  })

  describe('pagination of index.ejs should work', () => {
    test('three pages should be build', async () => {
      const all = await readdir(path.join(cwd, '_site', 'pages'))
      const pages = all.filter((a) => a.match(/page-[0-9]/))
      expect(pages.length).toBe(3)
    })

    test('each page should have correct titles', async () => {
      const titles = (await readdir(path.join(cwd, '_site', 'pages')))
        .filter((a) => a.match(/page-[0-9]/))
        .sort()
        .map((a) => cheerio.load(fs.readFileSync(a, 'utf-8')))
        .map(($) =>
          $('h1')
            .toArray()
            .map((a) => +$(a).text())
        )

      expect(titles).toEqual([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10],
      ])
    })
  })

  describe('pagination of data-as-context-key.ulka should work', () => {
    test('four pages should be build', async () => {
      const all = await readdir(path.join(cwd, '_site', 'pages2'))
      expect(all.length).toBe(4)
    })

    test('each page should have correct titles', async () => {
      const titles = (await readdir(path.join(cwd, '_site', 'pages2')))
        .map((a) => +cheerio.load(fs.readFileSync(a, 'utf-8'))('h1').text())
        .sort()

      expect(titles).toEqual([1, 2, 3, 4])
    })
  })

  describe('pagination of data-as-context-key2.ulka should work', () => {
    test('two pages should be build', async () => {
      const all = await readdir(path.join(cwd, '_site', 'pages3'))
      expect(all.length).toBe(2)
    })

    test('each page should have correct content', async () => {
      const contents = (await readdir(path.join(cwd, '_site', 'pages3')))
        .map((a) => fs.readFileSync(a, 'utf-8').trim())
        .sort()

      expect(contents).toEqual(['react', 'node'].sort())
    })
  })

  describe('pagination of data-as-object.ulka should work', () => {
    test('two pages should be build', async () => {
      const all = await readdir(path.join(cwd, '_site', 'pages4'))
      expect(all.length).toBe(2)
    })

    test('each page should have correct content', async () => {
      const contents = (await readdir(path.join(cwd, '_site', 'pages4')))
        .map((a) => fs.readFileSync(a, 'utf-8').trim())
        .sort()

      expect(contents).toEqual(['django', 'python'].sort())
    })
  })

  describe('pagination of data-as-context-key3.ulka should not work', () => {
    test('pagination should be undefined', () => {
      expect(
        fs
          .readFileSync(
            path.join(cwd, '_site', 'pages5', 'index.html'),
            'utf-8'
          )
          .trim()
      ).toBe('undefined')
    })
  })

  describe('pagination of with-single-value.ulka should work', () => {
    test('all pages should return number', async () => {
      const contents = (await readdir(path.join(cwd, '_site', 'pages6')))
        .map((a) => fs.readFileSync(a, 'utf-8').trim())
        .sort()

      expect(contents).toEqual(['number', 'number', 'number'])
    })
  })
})

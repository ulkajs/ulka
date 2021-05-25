import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
// import { FSWatcher } from 'chokidar'

import * as utils from '../../src/utils'
import { setup, watch, Ulka } from '../../src'

const cwd = path.join(__dirname, 'resources', 'with-watch')

// @ts-ignore
let ulka: Ulka
beforeAll(async () => {
  ulka = await setup(cwd, 'build', 'ulka-config.js')
})

afterAll(async () => {
  rimraf.sync(path.join(cwd, '_site'))
})

describe('e2e:with-watch - index.html', () => {
  afterAll(() => {
    fs.writeFileSync(
      path.join(cwd, 'index.ejs'),
      `---\ntitle: Hello World\n---\n<h1 class="title"><%= matter.title %></h1>`
    )
  })

  test('should rebuild on change', (done) => {
    const spy = jest.spyOn(utils, 'clearConsole')
    spy.mockImplementation(() => {})

    function callback(watcher: any) {
      expect(
        fs.readFileSync(path.join(cwd, '_site', 'index.html'), 'utf-8')
      ).toBe('')
      spy.mockRestore()
      watcher.close().finally(done)
    }

    watch(ulka, false, callback).then((watcher) => {
      watcher.once('ready', () => {
        fs.writeFileSync(path.join(cwd, 'index.ejs'), '')
      })
    })
  })
})

describe('e2e:with-watch - sample.css', () => {
  afterAll(() => {
    fs.writeFileSync(path.join(cwd, '_site', 'sample.css'), `* {width: 10px}`)
  })

  test('should rebuild on change', (done) => {
    const val = `* {width: ${Math.random()}px}`
    const spy = jest.spyOn(utils, 'clearConsole')
    spy.mockImplementation(() => {})

    function callback(watcher: any) {
      expect(
        fs.readFileSync(path.join(cwd, '_site', 'sample.css'), 'utf-8')
      ).toBe(val)
      spy.mockRestore()
      watcher.close().finally(done)
    }

    // @ts-ignore
    watch(ulka, undefined, callback).then((watcher) => {
      watcher.once('ready', () => {
        fs.writeFileSync(path.join(cwd, 'sample.css'), val)
      })
    })
  })
})

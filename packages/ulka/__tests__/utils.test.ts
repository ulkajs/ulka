import os from 'os'
import path from 'path'
import c from 'ansi-colors'
import { FSWatcher } from 'chokidar'
import {
  box,
  createValidContentConfig,
  liveReloadScript,
  defineConfig,
  getNetworkAddress,
  createWatcher,
  readConfigs,
  paginate,
  cleanLink,
  clearConsole,
} from '../src/utils'

describe('ulka:utils', () => {
  test('utils:paginate should paginate the array', () => {
    expect(paginate([1, 2, 3, 4], 2)).toEqual([
      { current: [1, 2], next: [3, 4], page: 1, prev: null, total: 2 },
      { current: [3, 4], next: null, page: 2, prev: [1, 2], total: 2 },
    ])
  })

  test('utils:cleanLink should add slash to front and end', () => {
    expect(cleanLink('/test/page')).toBe('/test/page/')
    expect(cleanLink('test/page')).toBe('/test/page/')
  })

  test('utils:cleanLink should remove index.html from end', () => {
    expect(cleanLink('test/page/index.html')).toBe('/test/page/')
    expect(cleanLink('test/page/index.html')).toBe('/test/page/')
  })

  test('utils:cleanLink should replace windows path sep with slash', () => {
    expect(cleanLink('test\\page')).toBe('/test/page/')
  })

  test('utils:box should print box around string with green color', () => {
    expect(box('\nHello World\n')).toMatchSnapshot()
  })

  test('utils:box should should print box around a string without color', () => {
    expect(box('\nHello World\n', 3, (char: string) => char)).toMatchSnapshot()
  })

  test('utils:box should print box around a string with a side paddin of 4', () => {
    expect(box('\nHello World\n', 4, (char: string) => char)).toMatchSnapshot()
  })

  test('utils:box should work for strings with ansi', () => {
    expect(
      box(`\n${c.green('Hello World')}\n`, 4, (char: string) => char)
    ).toMatchSnapshot()
  })

  test('utils:createValidContentConfig should return with expected type and values', () => {
    const contentConfig = createValidContentConfig({ match: 'm' })
    expect(contentConfig.match).toBe('m')
    expect(contentConfig.ignore).toEqual([])
    expect(typeof contentConfig.sort).toBe('function')
    expect(typeof contentConfig.forEach).toBe('function')
  })

  test('utils:createValidContentConfig should return match as empty array if match is not provided', () => {
    const config = createValidContentConfig({})
    expect(config.match).toEqual([])
  })

  test('utils:clearConsole should call console.clear and process.stdout.write', () => {
    const spyConsole = jest.spyOn(console, 'clear').mockImplementation(() => {})
    const spyStd = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true)

    clearConsole()

    expect(spyConsole.mock.calls.length).toBe(1)
    expect(spyStd.mock.calls.length).toBe(1)

    spyConsole.mockRestore()
    spyStd.mockRestore()
  })

  test('utils:clearConsole should call process.stdout.write with correct argument', () => {
    jest.spyOn(console, 'clear').mockImplementation(() => {})
    const spyStd = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true)

    const platform = process.platform

    Object.defineProperty(process, 'platform', { value: 'win32' })
    clearConsole()
    expect(spyStd.mock.calls[0][0]).toBe('\x1B[2J\x1B[0f')
    spyStd.mockClear()

    Object.defineProperty(process, 'platform', { value: 'linux' })
    clearConsole()
    expect(spyStd.mock.calls[0][0]).toBe('\x1B[2J\x1B[3J\x1B[H')

    Object.defineProperty(process, 'platform', { value: platform })

    jest.restoreAllMocks()
  })

  test('utils:liveReloadScript should have the required live reload script', () => {
    expect(liveReloadScript()).toMatchSnapshot()
  })

  test('utils:defineConfig should return the arg passed to it', () => {
    // @ts-ignore
    expect(defineConfig({ name: 'UlkaJs' })).toEqual({ name: 'UlkaJs' })
  })

  test('utils:getNetWorkAddress should return a string', () => {
    expect(typeof getNetworkAddress()).toBe('string')
  })

  test('utils:getNetWorkAddress should return Not Found if network address not found', () => {
    const spy = jest.spyOn(os, 'networkInterfaces')
    // @ts-ignore
    spy.mockReturnValue(() => [])

    expect(getNetworkAddress()).toBe('Not Found')

    spy.mockRestore()
  })

  test('utils:createWatcher should create and return a watcher', () => {
    const opts = { cwd: process.cwd(), configs: { output: '' } }
    // @ts-ignore
    const watcher = createWatcher(opts)
    watcher.close()
    expect(watcher instanceof FSWatcher).toBe(true)
  })

  test('utils:readConfigs should return default config as cofig path will not be found', async () => {
    const cwd = process.cwd()
    // @ts-ignore
    expect(await readConfigs({ cwd, configpath: 'ulka-config.js' })).toEqual({
      contents: {},
      input: cwd,
      layout: path.join(cwd, '_layouts'),
      output: path.join(cwd, '_site'),
      plugins: [],
      verbose: false,
      copy: [],
      metaData: {},
      concurrency: Infinity,
    })
  })
})

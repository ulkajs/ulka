import os from 'os'
import path from 'path'
import c from 'ansi-colors'
import { FSWatcher } from 'chokidar'
import {
  box,
  validContentConfig,
  liveReloadScript,
  defineConfig,
  getNetworkAddress,
  createWatcher,
  readConfigs,
} from '../src/utils'

describe('ulka:utils', () => {
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

  test('utils:validContentConfig should return with expected type and values', () => {
    // @ts-ignore
    const contentConfig = validContentConfig({ match: 'm' })
    expect(contentConfig.match).toBe('m')
    expect(contentConfig.ignore).toEqual([])
    expect(typeof contentConfig.sort).toBe('function')
    expect(typeof contentConfig.forEach).toBe('function')
  })

  test('utils:validContentConfig should log a error on invalid match', () => {
    const enabled = c.enabled
    c.enabled = false
    const spy = jest.spyOn(console, 'log')

    // @ts-ignore
    validContentConfig({ ignore: [] })

    expect(spy.mock.calls).toEqual([
      ['> Please provide valid "match" for content undefined'],
    ])

    c.enabled = enabled
    spy.mockRestore()
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

  test('utils:readConfigs should return default config as cofig path will not be found', () => {
    const cwd = process.cwd()
    // @ts-ignore
    expect(readConfigs({ cwd, configpath: 'ulka-config.js' })).toEqual({
      contents: {},
      include: path.join(cwd, '_includes'),
      input: cwd,
      layout: path.join(cwd, '_layouts'),
      output: path.join(cwd, '_site'),
      plugins: [],
      verbose: false,
    })
  })
})
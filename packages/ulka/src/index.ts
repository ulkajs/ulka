import c from 'ansi-colors'
import rimraf from 'rimraf'
import _slugify from 'slugify'

import type { FSWatcher } from 'chokidar'

import { Ulka } from './Ulka'
import { runPlugins, createWatcher, clearConsole } from './utils'

export async function setup(cwd: string, task: string, cpath: string) {
  return await Ulka.init(cwd, task, cpath)
}

export async function build(ulka: Ulka) {
  await runPlugins('beforeBuild', { ulka })

  try {
    await ulka.getLayouts()
    await ulka.getCollections()
    await ulka.write()
  } catch (e: any) {
    console.log('')
    console.log(e.message)
    e.custom && console.log(c.redBright(`> ${e.custom}`))
  }

  await runPlugins('afterBuild', { ulka })
}

export async function watch(
  ulka: Ulka,
  verbose = false,
  customFn?: Function
): Promise<FSWatcher> {
  await build(ulka)

  const watcher = createWatcher(ulka)

  watcher.on('all', async (eventName, filepath) => {
    if (!['add', 'change', 'unlink'].includes(eventName)) return

    clearConsole()
    console.log(c.blueBright(`> Change detected in ${filepath}\n`))

    if (filepath.includes(ulka.configpath)) {
      Object.keys(require.cache).forEach((a) => {
        a.includes(ulka.configpath) && delete require.cache[a]
      })
    }

    eventName === 'unlink' &&
      rimraf.sync(ulka.configs.output, { disableGlob: true })

    await ulka.reset()
    ulka.configs.verbose = verbose
    await build(ulka)

    ulka.server.log()

    filepath.endsWith('.css')
      ? ulka.server.wss.reloadCss()
      : ulka.server.wss.reload()

    customFn && customFn(watcher)
  })

  return watcher
}

export { Ulka, clearConsole }
export { FileInfo } from './FileInfo'
export { defineConfig, box, resolvePlugin, runPlugins } from './utils'
export { UlkaError } from './UlkaError'
export { Collection } from './Collection'
export { UlkaServer } from './UlkaServer'
export type {
  Configs,
  ContentConfig,
  PluginConfig,
  PluginsList,
  Plugin,
  PluginFunction,
  ValidContentConfig,
  PluginArg,
  PluginName,
} from './types'

export {
  Engines,
  EjsTemplate,
  LiquidTemplate,
  MdTemplate,
  Template,
  UlkaTemplate,
} from './Templates'

export const slugify = (str: string) =>
  _slugify(str, { lower: true, trim: true })

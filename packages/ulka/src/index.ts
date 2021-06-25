import c from 'ansi-colors'
import rimraf from 'rimraf'

import type { FSWatcher } from 'chokidar'

import { Ulka } from './Ulka'
import { runPlugins, createWatcher, clearConsole } from './utils'

export async function setup(cwd: string, task: string, cpath: string) {
  return await new Ulka(cwd, task, cpath).setup()
}

export async function build(ulka: Ulka) {
  await runPlugins('beforeBuild', { ulka })

  try {
    await ulka.getLayouts()
    await ulka.getCollections()
    await ulka.write()
  } catch (e) {
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

    eventName === 'unlink' &&
      rimraf.sync(ulka.configs.output, { disableGlob: true })

    ulka.reset()
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
export { defineConfig, box, resolvePlugin } from './utils'
export { UlkaError } from './UlkaError'
export { Collection } from './Collection'
export { UlkaServer } from './UlkaServer'
export type {
  Configs,
  ContentConfig,
  PluginConfig,
  Plugins,
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

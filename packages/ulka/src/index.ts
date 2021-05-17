import c from 'ansi-colors'

import { Ulka } from './Ulka'
import { runPlugins, createWatcher, clearConsole } from './utils'

export { Ulka }
export { FileInfo } from './FileInfo'
export { engines } from './Templates'
export { UlkaError } from './UlkaError'
export { Collection } from './Collection'
export { UlkaServer } from './UlkaServer'
export type { Configs, ContentConfig, PluginConfig, Plugins } from './types'

export async function setup(cwd: string, task: string, cpath: string) {
  const ulka = new Ulka(cwd, task, cpath)
  await runPlugins('afterSetup', { ulka })
  return ulka
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

export async function watch(ulka: Ulka, verbose = false) {
  await build(ulka)

  const watcher = createWatcher(ulka)

  watcher.on('all', async (eventName, filepath) => {
    if (!['add', 'change', 'unlink'].includes(eventName)) return

    clearConsole()
    console.log(c.blueBright(`> Change detected in ${filepath}\n`))

    ulka.reset()
    ulka.configs.verbose = verbose
    await build(ulka)

    ulka.server.log()

    filepath.endsWith('.css')
      ? ulka.server.wss.reloadCss()
      : ulka.server.wss.reload()
  })

  return watcher
}

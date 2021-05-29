import fs from 'fs'
import c from 'ansi-colors'

import { engines, Engines } from './Templates'
import { UlkaServer } from './UlkaServer'
import { Collection } from './Collection'
import { readConfigs, resolvePlugin, runPlugins, emptyPlugins } from './utils'

import type { Configs, PluginFunction, PluginName, Plugins } from './types'

export class Ulka {
  public engines: Engines = engines()
  public layout?: Collection
  public configs: Configs
  public server: UlkaServer
  public plugins: Plugins
  public layoutFuncCache: { [key: string]: (...args: any) => any } = {}
  public collections: { [key: string]: Collection } = {}
  // only to provide in context, don't change this ever
  public collectionContents: any

  constructor(
    public cwd: string,
    public task: string,
    public configpath: string,
    public port = 8080
  ) {
    this.plugins = emptyPlugins()
    this.configs = readConfigs(this)
    this.server = new UlkaServer(this.configs.output, this.port)
    this.configs.plugins.forEach((p) => resolvePlugin(p, this))

    this.collectionContents = new Proxy(this.collections, {
      get(target, key: string) {
        if (key === 'all') {
          const tmp: { [key: string]: any }[] = []

          Object.values(target).forEach((val) => {
            tmp.push(...val.contents.map((c) => c.context))
          })

          return tmp
        }

        if (!target[key]) return []
        return target[key].contents.map((c) => c.context)
      },
    })
  }

  async setup() {
    this.engines = engines()
    await runPlugins('afterSetup', { ulka: this })
    return this
  }

  use<T extends PluginName = any>(obj: { [key in T]: PluginFunction<key> }) {
    for (const [key, plugin] of Object.entries(obj)) {
      this.plugins[key as PluginName].push(plugin as PluginFunction)
    }
    return this
  }

  reset() {
    this.collections = {}
    this.layout = undefined
    this.layoutFuncCache = {}

    this.plugins = emptyPlugins()
    this.configs = readConfigs(this)
    this.configs.plugins.forEach((p) => resolvePlugin(p, this))

    return this
  }

  async getLayouts() {
    if (!this.configs.layout && !fs.existsSync(this.configs.layout)) return

    const config = { match: '**' }
    const collection = new Collection(this, '_layout').updateConfig(config)

    await collection.getContents(this.configs.layout)
    await collection.read()

    this.layout = collection
  }

  async getCollections() {
    for (const name of Object.keys(this.configs.contents)) {
      const config = this.configs.contents[name]
      const collection = new Collection(this, name).updateConfig(config)

      await collection.getContents()
      await collection.read()

      this.collections[name] = collection
    }

    Object.values(this.collections).forEach((cl) => cl.paginate())
    return this
  }

  async write() {
    const start = new Date().getTime()
    let length = 0

    for (const name of Object.keys(this.collections)) {
      await this.collections[name].write()
      length += this.collections[name].contents.length
    }

    const end = new Date().getTime() - start

    const timetaken = end > 100 ? end / 1000 + 's' : end + 'ms'

    console.log(c.greenBright(`\n> Built ${length} files in ${timetaken}`))
  }
}

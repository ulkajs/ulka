import fs from 'fs'
import c from 'ansi-colors'

import { engines } from './Templates'
import { UlkaServer } from './UlkaServer'
import { Collection } from './Collection'
import { readConfigs, resolvePlugin } from './utils'

import type { Configs, Plugins } from './types'

export class Ulka {
  public engines = engines
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
    public configpath = 'ulka-config',
    public port = 8080
  ) {
    this.plugins = emptyPlugins()
    this.configs = readConfigs(this)
    this.server = new UlkaServer(this.configs.output, this.port)
    this.configs.plugins.forEach((p) => resolvePlugin(p, this))

    this.collectionContents = new Proxy(this.collections, {
      get(target, key: string) {
        if (!target[key]) return []
        return target[key].contents.map((c) => c.context)
      },
    })
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

    const layoutConfig = {
      match: '**',
      sort() {},
      forEach() {},
      ignore: [],
    }

    const collection = new Collection(this, layoutConfig, '_layout')
    await collection.getContents(this.configs.layout)
    collection.read()

    this.layout = collection
  }

  async getCollections() {
    for (const name of Object.keys(this.configs.contents)) {
      const config = this.configs.contents[name]
      const collection = new Collection(this, config, name)

      await collection.getContents()
      collection.read()

      this.collections[name] = collection
    }
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

function emptyPlugins(): Plugins {
  return {
    afterBuild: [],
    afterRender: [],
    afterSetup: [],
    afterWrite: [],
    beforeBuild: [],
    beforeRender: [],
    beforeWrite: [],
  }
}

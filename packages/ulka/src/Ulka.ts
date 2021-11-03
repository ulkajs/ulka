import fs from 'fs'
import util from 'util'
import path from 'path'
import pMap from 'p-map'
import fg from 'fast-glob'
import c from 'ansi-colors'

import { UlkaServer } from './UlkaServer'
import { Collection } from './Collection'
import { engines, Engines } from './Templates'
import { readConfigs, resolvePlugin, runPlugins, emptyPlugins } from './utils'

import type { Configs, Plugins } from './types'

const copyAsync = util.promisify(fs.copyFile)

export class Ulka {
  public engines: Engines = engines()
  public layout?: Collection
  public configs: Configs
  public server: UlkaServer
  public plugins: Plugins
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
    this.server = new UlkaServer('', this.port)

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

    this.configs = readConfigs(this)
    this.configs.plugins.forEach((p) => resolvePlugin(p, this))

    this.server.base = this.configs.output
  }

  async setup() {
    this.engines = engines()
    await runPlugins('afterSetup', { ulka: this })
    return this
  }

  reset() {
    this.collections = {}
    this.layout = undefined
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

    length += (await this.copy()).length

    const end = new Date().getTime() - start
    const timetaken = end > 100 ? end / 1000 + 's' : end + 'ms'
    console.log(c.greenBright(`\n> Built ${length} files in ${timetaken}`))
  }

  async copy(cwd = this.configs.input) {
    const files = await fg(this.configs.copy, { cwd, absolute: true })

    await pMap(
      files,
      (file) => {
        const relative = path.relative(this.configs.input, file)
        const dest = path.join(this.configs.output, relative)

        return copyAsync(file, dest)
      },
      { concurrency: this.configs.concurrency }
    )

    return files
  }
}

import fg from 'fast-glob'

import { runPlugins } from './utils'
import { FileInfo } from './FileInfo'
import { UlkaError } from './UlkaError'

import type { Ulka } from './Ulka'
import type { Template } from './Templates'
import type { ContentConfig } from './types'

export class Collection {
  public contents: Template[] = []

  constructor(
    public ulka: Ulka,
    public config: ContentConfig,
    public name: string
  ) {}

  read() {
    try {
      for (const templ of this.contents) {
        templ.readMatter()
        templ.createCtx()
      }

      this.contents.sort(this.config.sort)
      this.contents.forEach(this.config.forEach)
    } catch (e) {
      throw new UlkaError(
        e.message,
        `Error while reading from collection ${this.name}`
      )
    }
  }

  async write() {
    await Promise.all(
      this.contents.map(async (tpl) => {
        const opts = { content: tpl, type: 'file', ulka: this.ulka }

        await runPlugins('beforeRender', opts)
        await tpl.render()
        await runPlugins('afterRender', opts)

        await runPlugins('beforeWrite', opts)
        await tpl.write()
        await runPlugins('afterWrite', opts)

        this.ulka.configs.verbose && tpl.log()
      })
    )
    return this
  }

  async getContents(cwd = this.ulka.configs.input) {
    try {
      const files = await fg(this.config.match, {
        cwd,
        ignore: this.config.ignore,
        absolute: true,
        dot: true,
      })

      this.contents = await Promise.all(
        files.map(async (file) => {
          const fileinfo = await new FileInfo(file).read()

          const Template =
            this.ulka.engines[fileinfo.parsedpath.ext] ||
            this.ulka.engines.default

          return new Template(this, fileinfo)
        })
      )
    } catch (e) {
      throw new UlkaError(
        e.message,
        `Error occured while getting contents from collection ${this.name}`
      )
    }
  }
}

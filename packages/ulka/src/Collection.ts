import path from 'path'
import pMap from 'p-map'
import fg from 'fast-glob'
import get from 'get-value'

import { FileInfo } from './FileInfo'
import { UlkaError } from './UlkaError'
import {
  cleanLink,
  createValidContentConfig,
  paginate,
  runPlugins,
} from './utils'

import type { Ulka } from './Ulka'
import type { Template } from './Templates'
import type { ContentConfig, ValidContentConfig } from './types'

export class Collection {
  public contents: Template[] = []
  public config?: ValidContentConfig

  constructor(public ulka: Ulka, public name: string) {}

  updateConfig(config: ContentConfig) {
    this.config = createValidContentConfig(config)
    return this
  }

  async read() {
    try {
      for (const templ of this.contents) {
        await runPlugins('beforeCreateContext', {
          template: templ,
          ulka: this.ulka,
        })

        templ.readMatter()
        templ.createCtx()

        await runPlugins('afterCreateContext', {
          template: templ,
          ulka: this.ulka,
        })
      }

      this.contents.sort(this.config!.sort)
      this.contents.forEach(this.config!.forEach)
    } catch (e: any) {
      throw new UlkaError(
        e.message,
        `Error while reading from collection ${this.name}`
      )
    }
  }

  async write() {
    await pMap(
      this.contents,
      async (tpl) => {
        const opts = { template: tpl, ulka: this.ulka }

        await runPlugins('beforeRender', opts)
        await tpl.render()
        await runPlugins('afterRender', opts)

        await runPlugins('beforeWrite', opts)
        await tpl.write()
        await runPlugins('afterWrite', opts)

        this.ulka.configs.verbose && tpl.log()
      },
      { concurrency: this.ulka.configs.concurrency }
    )

    return this
  }

  async getContents(cwd = this.ulka.configs.input) {
    try {
      const files = await fg(this.config!.match, {
        cwd,
        ignore: this.config!.ignore,
        absolute: true,
        dot: true,
      })

      this.contents = await pMap(
        files,
        async (file: string) => {
          const fileinfo = await new FileInfo(file).read()

          const Template =
            this.ulka.engines[fileinfo.parsedpath.ext] ||
            this.ulka.engines.default

          return new Template(
            this.ulka,
            fileinfo,
            this.name,
            this.config!.layout,
            this.config!.link
          )
        },
        { concurrency: this.ulka.configs.concurrency }
      )
    } catch (e: any) {
      throw new UlkaError(
        e.message,
        `Error occured while getting contents from collection ${this.name}`
      )
    }
  }

  paginate() {
    const paginatedContents = []
    for (const tpl of this.contents) {
      if (typeof tpl.context.matter._paginate !== 'object') continue

      const {
        size,
        data,
        collection,
        permalink: _link,
        limit = Infinity,
        singleValue = false,
      } = tpl.context.matter._paginate
      let arr: any[] = []

      if (typeof collection === 'string') {
        arr = this.ulka.collectionContents[collection]
      } else if (typeof data === 'string') {
        arr = get(tpl.context, data.trim())
        arr = Array.isArray(arr)
          ? arr
          : typeof arr === 'object'
          ? Object.keys(arr)
          : []
      } else if (Array.isArray(data)) {
        arr = data
      } else if (typeof data === 'object') {
        arr = Object.keys(data)
      }

      if (arr.length === 0) continue

      const paginatedArr = paginate(arr, size || 10)
      const len = Math.min(limit, paginatedArr.length)

      for (let i = 0; i < len; i++) {
        if (singleValue) {
          paginatedArr[i].current = paginatedArr[i].current[0]
          paginatedArr[i].prev = paginatedArr[i].prev?.[0]
          paginatedArr[i].next = paginatedArr[i].next?.[0]
        }

        if (i === 0 && tpl.link !== '/_PAGINATE_/') {
          tpl.context.pagination = paginatedArr[i]
        } else {
          const newTpl: Template = i === 0 ? tpl : tpl.clone()
          newTpl.context.pagination = paginatedArr[i]

          let link =
            typeof _link === 'string'
              ? newTpl._renderUlkaTemplate(_link)
              : tpl.link + `page-${paginatedArr[i].page}/index.html`

          let buildPath = path.join(
            this.ulka.configs.output,
            ...link.split('/')
          )

          if (link.endsWith('/')) buildPath = path.join(buildPath, 'index.html')

          link = cleanLink(link)

          newTpl.link = link
          newTpl.buildPath = buildPath

          i !== 0 && paginatedContents.push(newTpl)
        }
      }
    }
    this.contents.push(...paginatedContents)
  }
}

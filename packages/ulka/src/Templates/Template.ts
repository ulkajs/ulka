import fs from 'fs'
import util from 'util'
import path from 'path'
import c from 'ansi-colors'
import { Liquid } from 'liquidjs'
import matter from 'gray-matter'

import { UlkaError } from '../UlkaError'

import { FileInfo } from '../FileInfo'
import { Collection } from '../Collection'

const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)
const liquid = new Liquid()

export class Template {
  public content: string | Buffer = ''
  public link: string = ''
  public buildPath: string = ''

  public context: { [key: string]: any } = {}

  constructor(public collection: Collection, public fileinfo: FileInfo) {}

  async compile() {
    return async (_ctx: object = {}) => this.content
  }

  protected async layout(
    content: string | Buffer,
    ctx: object = {}
  ): Promise<string | Buffer> {
    const matter = this.context.matter
    const { layout, configs, layoutFuncCache } = this.collection.ulka

    if (!layout || !configs.layout) return content

    if (!matter._layout && !this.collection.config.layout) return content

    const matterLayout = matter._layout
      ? configs.liquidInSpecialFrontMatter
        ? await liquid.parseAndRender(matter._layout, this.context)
        : matter._layout
      : null

    const _layout =
      matterLayout ||
      (typeof this.collection.config.layout === 'function'
        ? this.collection.config.layout(this)
        : this.collection.config.layout)

    if (typeof _layout !== 'string') return content

    const lpath = path.join(configs.layout, _layout)

    try {
      const tpl = layout.contents.find(
        (v: Template) => v.fileinfo.filepath === lpath
      )
      if (!tpl) return content

      let renderFunc = layoutFuncCache[lpath]

      if (!renderFunc) {
        renderFunc = await tpl.compile()
        layoutFuncCache[lpath] = renderFunc
      }

      const _ = { ...this.context, content, ...ctx }
      const contentWithLayout = await renderFunc({ _ })

      return tpl.layout(contentWithLayout, { _ })
    } catch (e) {
      const cwd = this.collection.ulka.cwd
      const rlpath = path.relative(cwd, lpath)
      const rfpath = path.relative(cwd, this.fileinfo.filepath)

      throw new UlkaError(
        e.message,
        `Error occured while rendering layout ${rlpath} for ${rfpath}`
      )
    }
  }

  public async render(ctx?: object) {
    try {
      await mkdir(path.parse(this.buildPath).dir, { recursive: true })

      const fn = await this.compile()
      const content = await fn(ctx)
      this.content = await this.layout(content)
    } catch (e) {
      const cwd = this.collection.ulka.cwd
      const rfpath = path.relative(cwd, this.fileinfo.filepath)

      if (e.custom) throw e

      throw new UlkaError(
        e.message,
        `Error occured while rendering file ${rfpath}`
      )
    }
  }

  public async write(content: string | Buffer = this.content) {
    try {
      await writeFile(this.buildPath, content)
    } catch (e) {
      const cwd = this.collection.ulka.cwd
      const rbpath = path.relative(cwd, this.buildPath)
      const rfpath = path.relative(cwd, this.fileinfo.filepath)

      throw new UlkaError(
        e.message,
        `Error occured while writing file ${rfpath} to ${rbpath}`
      )
    }

    return this
  }

  createCtx(ctx: object = {}) {
    const matter = this.context.matter || {}
    const ulka = this.collection.ulka
    let { link, buildPath } = this.getBuildPath()

    this.context = {
      link,
      matter,
      buildPath,
      cwd: ulka.cwd,
      task: ulka.task,
      configs: ulka.configs,
      content: this.content,
      fileinfo: this.fileinfo,
      name: this.collection.name,
      _collections: ulka.collections,
      collections: ulka.collectionContents,
      ...ctx,
    }

    if (matter._link) {
      link = ulka.configs.liquidInSpecialFrontMatter
        ? liquid.parseAndRenderSync(matter._link, this.context)
        : matter._link

      buildPath = path.join(...link.split('/'))
      if (link.endsWith('/index.html')) link = link.replace('/index.html', '/')
    } else if (this.collection.config.link) {
      link =
        typeof this.collection.config.link === 'function'
          ? this.collection.config.link(this)
          : this.collection.config.link

      buildPath = path.join(...link.split('/'))
      if (link.endsWith('/index.html')) link = link.replace('/index.html', '/')
    }

    buildPath = path.join(ulka.configs.output, buildPath)

    link = !link.startsWith('/') ? '/' + link : link

    if (link !== '/' && !link.endsWith('/')) link += '/'

    this.link = link
    this.buildPath = buildPath
    this.context.link = link
    this.context.buildPath = buildPath

    return this
  }

  readMatter() {
    if (!this.hasMatter) {
      if (this.contentShouldBeString) this.content = this.fileinfo.str
      else this.content = this.fileinfo.buffer!

      this.context.matter = {}
      return this
    }

    const { data, content } = matter(this.fileinfo.str)

    this.content = content
    this.context.matter = data

    return this
  }

  getBuildPath(ext = this.buildExt) {
    let rel = path.relative(
      this.collection.ulka.configs.input,
      this.fileinfo.parsedpath.dir
    )

    let name = this.fileinfo.parsedpath.name

    if (ext === '.html') {
      if (name !== 'index') {
        rel = path.join(rel, name)
        name = 'index'
      }
    }

    const buildPath = path.join(rel, name + ext)

    const link = rel.split(path.sep).join('/')

    return { link, buildPath }
  }

  log() {
    const ulka = this.collection.ulka
    const output = path
      .relative(ulka.cwd, this.buildPath)
      .split(path.sep)
      .join('/')

    console.log(c.blue.bold('>'), c.dim(output))
  }

  get hasMatter() {
    return true
  }

  get buildExt() {
    return this.fileinfo.parsedpath.ext
  }

  get contentShouldBeString() {
    return this.hasMatter
  }
}

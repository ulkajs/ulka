import fs from 'fs'
import util from 'util'
import path from 'path'
import c from 'ansi-colors'
import matter from 'gray-matter'

import { UlkaError } from '../UlkaError'

import { FileInfo } from '../FileInfo'
import { Collection } from '../Collection'

const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

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

    if (!layout || !matter._layout || !configs.layout) return content
    const lpath = path.join(configs.layout, matter._layout)

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

  async renderAndWrite() {
    const ulka = this.collection.ulka

    await this.render()

    await this.write()

    ulka.configs.verbose && this.log()

    return this
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
    let { link, buildPath } = this.getBuildPath()

    const matter = this.context.matter || {}
    if (matter._link) {
      link = matter._link
      buildPath = path.join(...link.split('/'))
    }

    buildPath = path.join(this.collection.ulka.configs.output, buildPath)

    this.link = '/' + link

    if (this.link !== '/') this.link += '/'

    this.buildPath = buildPath

    this.context = {
      matter,
      content: this.content,
      configs: this.collection.ulka.configs,
      cwd: this.collection.ulka.cwd,
      task: this.collection.ulka.task,
      link: this.link,
      fileinfo: this.fileinfo,
      buildPath: this.buildPath,
      name: this.collection.name,
      collections: this.collection.ulka.collectionContents,
      ...ctx,
    }

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

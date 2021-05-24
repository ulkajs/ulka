import fs from 'fs'
import util from 'util'
import path from 'path'
import c from 'ansi-colors'
import matter from 'gray-matter'
import * as utemp from '@ulkajs/template-engine'

import { UlkaError } from '../UlkaError'

import type { Ulka } from '../Ulka'
import type { FileInfo } from '../FileInfo'

const writeFile = util.promisify(fs.writeFile)
const mkdir = util.promisify(fs.mkdir)

export class Template {
  public content: string | Buffer = ''
  public link: string = ''
  public buildPath: string = ''

  public context: { [key: string]: any } = {}

  constructor(
    public ulka: Ulka,
    public fileinfo: FileInfo,
    public configName?: string,
    public configLayout?: Function | string | null,
    public configLink?: Function | string | null
  ) {}

  async compile() {
    return async (_ctx: object = {}) => this.content
  }

  protected async layout(
    content: string | Buffer,
    ctx: object = {}
  ): Promise<string | Buffer> {
    const matter = this.context.matter

    if (!this.ulka.layout || !this.ulka.configs.layout) return content

    if (!matter._layout && !this.configLayout) return content

    const matterLayout = matter._layout
      ? this.ulka.configs.templateSpecialFrontMatter
        ? utemp.render(matter._layout, this.context, {
            base: this.ulka.configs.include,
          })
        : matter._layout
      : null

    const _layout =
      matterLayout ||
      (typeof this.configLayout === 'function'
        ? this.configLayout(this)
        : this.configLayout)

    if (typeof _layout !== 'string') return content

    const lpath = path.join(this.ulka.configs.layout, _layout)

    try {
      const tpl = this.ulka.layout.contents.find(
        (v: Template) => v.fileinfo.filepath === lpath
      )
      if (!tpl) return content

      let renderFunc = this.ulka.layoutFuncCache[lpath]

      if (!renderFunc) {
        renderFunc = await tpl.compile()
        this.ulka.layoutFuncCache[lpath] = renderFunc
      }

      const _ = { ...this.context, content, ...ctx }
      const contentWithLayout = await renderFunc({ _ })

      return tpl.layout(contentWithLayout, { _ })
    } catch (e) {
      const cwd = this.ulka.cwd
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
      const cwd = this.ulka.cwd
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
      const cwd = this.ulka.cwd
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
    let { link, buildPath } = this.getBuildPath()

    this.context = {
      link,
      matter,
      buildPath,
      cwd: this.ulka.cwd,
      task: this.ulka.task,
      content: this.content,
      name: this.configName,
      fileinfo: this.fileinfo,
      configs: this.ulka.configs,
      _collections: this.ulka.collections,
      collections: this.ulka.collectionContents,
      ...ctx,
    }

    if (matter._link) {
      link = this.ulka.configs.templateSpecialFrontMatter
        ? utemp.render(matter._link, this.context, {
            base: this.ulka.configs.include,
          })
        : matter._link

      buildPath = path.join(...link.split('/'))
      if (link.endsWith('/index.html')) link = link.replace('/index.html', '/')
    } else if (this.configLink) {
      link =
        typeof this.configLink === 'function'
          ? this.configLink(this)
          : this.configLink

      buildPath = path.join(...link.split('/'))
      if (link.endsWith('/index.html')) link = link.replace('/index.html', '/')
    }

    buildPath = path.join(this.ulka.configs.output, buildPath)

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
      this.ulka.configs.input,
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
    const output = path
      .relative(this.ulka.cwd, this.buildPath)
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

import fs from 'fs'
import util from 'util'
import path from 'path'
import c from 'ansi-colors'
import slugify from 'slugify'
import matter from 'gray-matter'
import normalizePath from 'normalize-path'
import * as ulkaTemplate from '@ulkajs/template-engine'

import { cleanLink } from '../utils'
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
    public configLayout?: ((temp: Template) => string) | string | null,
    public configLink?: ((temp: Template) => string) | string | null
  ) {}

  static reset() {}

  clone() {
    const Template =
      this.ulka.engines[this.fileinfo.parsedpath.ext] ||
      this.ulka.engines.default

    const obj = new Template(
      this.ulka,
      this.fileinfo,
      this.configName,
      this.configLayout,
      this.configLink
    )

    obj.content = this.content
    obj.link = this.link
    obj.buildPath = this.buildPath
    obj.context = { ...this.context }
    return obj
  }

  async compile() {
    return async (_ctx: object = {}) => this.content
  }

  protected async layout(
    content: string | Buffer,
    ctx: { [key: string]: any } = {}
  ): Promise<string | Buffer> {
    const matter = this.context.matter

    // if matter._layout `false` or `null`
    // if there is no layout collection or no layout directory
    // if matter._layout is not defined && no layout passed from content config
    // then return content

    if (
      !this.ulka.layout ||
      !this.ulka.configs.layout ||
      matter._layout === false ||
      matter._layout === null ||
      (typeof matter._layout === 'undefined' && !this.configLayout)
    ) {
      return content
    }

    // give first priority to matter._layout and then from config

    const _layout = matter._layout
      ? this._renderUlkaTemplate(matter._layout)
      : typeof this.configLayout === 'function'
      ? this.configLayout(this)
      : this.configLayout

    if (typeof _layout !== 'string') return content

    // absolute path to _layout
    const lpath = normalizePath(path.join(this.ulka.configs.layout, _layout))

    try {
      // find the layout in layout collection
      // if not found return content

      const tpl = this.ulka.layout.contents.find(
        (v: Template) => v.fileinfo.filepath === lpath
      )
      if (!tpl) return content

      const renderFunc = await tpl.compile()

      // current template context is inside _ cause layout will have its own context
      // _ in layout will be reference to current template context
      const matter1 = tpl.context.matter || {}
      const matter2 = this.context.matter || {}
      const matter3 = ctx.matter || {}
      const context = {
        ...this.context,
        ...ctx,
        content,
        matter: { ...matter1, ...matter2, ...matter3 },
      }

      // const contentWithLayout = await renderFunc({ _ })
      const contentWithLayout = await renderFunc(context)

      // recurse the current function incase layout has another layout
      return tpl.layout(contentWithLayout, context)
    } catch (e: any) {
      throw new UlkaError(
        e.message,
        `Error occured while rendering layout ${path.relative(
          this.ulka.cwd,
          lpath
        )} for ${path.relative(this.ulka.cwd, this.fileinfo.filepath)}`
      )
    }
  }

  public async render(ctx?: object) {
    try {
      await mkdir(path.parse(this.buildPath).dir, { recursive: true })

      const renderFunction = await this.compile()
      const content = await renderFunction(ctx)
      this.content = await this.layout(content)
    } catch (e: any) {
      throw new UlkaError(
        e.message,
        `Error occured while rendering file ${path.relative(
          this.ulka.cwd,
          this.fileinfo.filepath
        )}`
      )
    }
  }

  public async write(content: string | Buffer = this.content) {
    if (!this.buildPath || this.buildPath === this.ulka.configs.output)
      return this
    try {
      await writeFile(this.buildPath, content)
    } catch (e: any) {
      throw new UlkaError(
        e.message,
        `Error occured while writing file ${path.relative(
          this.ulka.cwd,
          this.fileinfo.filepath
        )} to ${path.relative(this.ulka.cwd, this.buildPath)}`
      )
    }

    return this
  }

  createCtx(ctx: object = {}) {
    const matter = this.context.matter
    const { link, buildPath } = this.getBuildPath()

    this.link = link
    this.buildPath = buildPath

    const that = this
    this.context = {
      matter,
      get link() {
        return that.link
      },
      get buildPath() {
        return that.buildPath
      },
      cwd: this.ulka.cwd,
      task: this.ulka.task,
      get content() {
        return that.content
      },
      name: this.configName,
      fileinfo: this.fileinfo,
      configs: this.ulka.configs,
      _collections: this.ulka.collections,
      collections: this.ulka.collectionContents,
      metaData: this.ulka.configs.metaData,
      slugify: (str: string) => slugify(str, { lower: true, trim: true }),
      ...ctx,
    }

    const _link = matter._permalink
      ? this._renderUlkaTemplate(matter._permalink)
      : typeof this.configLink === 'function'
      ? this.configLink(this)
      : this.configLink

    if (_link) {
      this.link = cleanLink(_link)

      this.buildPath = path.join(...this.link.split('/'))

      this.link.endsWith('/') &&
        (this.buildPath = path.join(this.buildPath, 'index.html'))
    }

    this.buildPath = path.join(this.ulka.configs.output, this.buildPath)

    return this
  }

  readMatter() {
    if (!this.hasMatter) {
      if (this.contentShouldBeString) {
        this.content = this.fileinfo.str
      } else {
        this.content = this.fileinfo.buffer!
      }

      this.context.matter = {}
    } else {
      const { data, content } = matter(this.fileinfo.str)
      this.content = content
      this.context.matter = data
    }

    return this
  }

  getBuildPath(ext = this.buildExt) {
    let rel = path.relative(
      this.ulka.configs.input,
      this.fileinfo.parsedpath.dir
    )

    let name = this.fileinfo.parsedpath.name

    // if ext = html and name != index.html then create folder with name and change name to index
    // for eg:
    // about.html => about/index.html
    // about/index.html => about/index.html
    if (ext === '.html' && name !== 'index') {
      rel = path.join(rel, slugify(name, { lower: true, trim: true }))
      name = 'index'
    }

    const buildPath = path.join(rel, name + ext)

    const link = cleanLink(rel)

    return { link, buildPath }
  }

  log() {
    const output = path
      .relative(this.ulka.cwd, this.buildPath)
      .split(path.sep)
      .join('/')

    console.log(c.blue.bold('>'), c.dim(output))
  }

  _renderUlkaTemplate(data: string, context: object = {}) {
    const base = path.dirname(this.fileinfo.filepath)
    return ulkaTemplate.render(data, { ...this.context, ...context }, { base })
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

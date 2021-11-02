import path from 'path'
import MarkdownIt from 'markdown-it'

import { Template } from './Template'
import { LiquidTemplate } from './LiquidTemplate'

export class MdTemplate extends Template {
  static md = new MarkdownIt()

  async compile() {
    const html = MdTemplate.md.render(this.content as string)
    const tpl = LiquidTemplate.liquid.parse(html)

    return async (ctx: object = {}) => {
      const context = { ...this.context, ...ctx }
      return await LiquidTemplate.liquid.render(tpl, context, {
        root: path.dirname(this.fileinfo.filepath),
        dynamicPartials: true,
      })
    }
  }

  get hasMatter() {
    return true
  }

  get buildExt() {
    return '.html'
  }
}

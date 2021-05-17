import { Liquid } from 'liquidjs'

import { Template } from './Template'

export class LiquidTemplate extends Template {
  static liquid = new Liquid()

  async compile() {
    const template = LiquidTemplate.liquid.parse(this.content as string)

    return async (ctx: object = {}) => {
      const context = { ...this.context, ...ctx }
      return await LiquidTemplate.liquid.render(template, context)
    }
  }

  get hasMatter() {
    return true
  }

  get buildExt() {
    return '.html'
  }
}

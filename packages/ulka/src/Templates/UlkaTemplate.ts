import * as ulka from '@ulkajs/template-engine'

import { Template } from './Template'

export class UlkaTemplate extends Template {
  static ulka = ulka

  async compile() {
    return async (ctx: object = {}) => {
      return UlkaTemplate.ulka.render(
        this.content as string,
        { ...this.context, ...ctx },
        { base: this.collection.ulka.configs.include }
      )
    }
  }

  get hasMatter() {
    return true
  }

  get buildExt() {
    return '.html'
  }
}

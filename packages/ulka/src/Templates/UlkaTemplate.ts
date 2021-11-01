import path from 'path'
import * as ulka from '@ulkajs/template-engine'

import { Template } from './Template'

export class UlkaTemplate extends Template {
  static ulka = ulka

  async compile() {
    return async (ctx: object = {}) => {
      return UlkaTemplate.ulka.render(
        this.content as string,
        { ...this.context, ...ctx },
        { base: path.dirname(this.fileinfo.filepath) }
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

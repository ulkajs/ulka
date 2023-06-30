import ejs from 'ejs'
import path from 'path'

import { Template } from './Template'

export class EjsTemplate extends Template {
  static ejs = ejs

  static reset(): void {
    EjsTemplate.ejs = ejs
  }

  async compile() {
    const fn = EjsTemplate.ejs.compile(this.content as string, {
      beautify: false,
      filename: this.fileinfo.filepath,
      root: path.dirname(this.fileinfo.filepath),
    })

    return async (ctx: object = {}) => {
      return fn({ ...this.context, ...ctx })
    }
  }

  get hasMatter() {
    return true
  }

  get buildExt() {
    return '.html'
  }
}

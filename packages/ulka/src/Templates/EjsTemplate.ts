import ejs from 'ejs'

import { Template } from './Template'

export class EjsTemplate extends Template {
  static ejs = ejs

  async compile() {
    const fn = EjsTemplate.ejs.compile(this.content as string, {
      beautify: false,
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

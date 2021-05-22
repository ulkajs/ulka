import fs from 'fs'
import sass from 'sass'
import { Template, PluginFunction } from 'ulka'

class SassTemplate extends Template {
  static sass = sass
  static opts: sass.Options = {}

  async compile() {
    return async () => {
      const result = SassTemplate.sass.renderSync({
        data: this.content as string,
        file: this.fileinfo.filepath,
        outFile: this.buildPath,
        ...SassTemplate.opts,
        indentedSyntax: this.fileinfo.parsedpath.ext === '.sass',
      })

      if (result.map) {
        fs.writeFileSync(this.buildPath + '.map', result.map)
      }

      return result.css
    }
  }

  get hasMatter() {
    return false
  }

  get buildExt() {
    return '.css'
  }

  get contentShouldBeString() {
    return true
  }
}

export default (opts: sass.Options = {}) => ({
  afterSetup({ ulka }: Parameters<PluginFunction>[0]) {
    SassTemplate.opts = opts

    ulka.engines['.sass'] = SassTemplate
    ulka.engines['.scss'] = SassTemplate
  },
})

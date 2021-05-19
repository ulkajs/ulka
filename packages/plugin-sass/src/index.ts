import fs from 'fs'
import sass from 'sass'
import { Template, PluginFunction } from 'ulka'

// cache filepath, sass and css
const cache: { [key: string]: { sass: string; css: Buffer } } = {}

class SassTemplate extends Template {
  static sass = sass
  static opts: sass.Options = {}

  async compile() {
    return async () => {
      if (cache[this.fileinfo.filepath]?.sass === this.content)
        return cache[this.fileinfo.filepath].css

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

      cache[this.fileinfo.filepath] = {
        sass: this.content as string,
        css: result.css,
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

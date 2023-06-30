import fs from 'fs'
import path from 'path'
import util from 'util'
import { StringDecoder } from 'string_decoder'

const decoder = new StringDecoder()
const readFileAsync = util.promisify(fs.readFile)

export class FileInfo {
  public parsedpath = path.parse(this.filepath)
  public buffer: Buffer | undefined

  constructor(public filepath: string) {}

  async read() {
    this.buffer = await readFileAsync(this.filepath)
    return this
  }

  get str() {
    if (!this.buffer) return ''
    return decoder.write(this.buffer)
  }
}

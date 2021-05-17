import { Template } from './Template'
import { MdTemplate } from './MdTemplate'
import { EjsTemplate } from './EjsTemplate'
import { UlkaTemplate } from './UlkaTemplate'
import { LiquidTemplate } from './LiquidTemplate'

export const engines: { [key: string]: typeof Template } = {
  '.ejs': EjsTemplate,
  '.liquid': LiquidTemplate,
  '.md': MdTemplate,
  '.ulka': UlkaTemplate,
  default: Template,
}

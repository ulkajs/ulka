import { Template } from './Template'
import { MdTemplate } from './MdTemplate'
import { EjsTemplate } from './EjsTemplate'
import { UlkaTemplate } from './UlkaTemplate'
import { LiquidTemplate } from './LiquidTemplate'

export interface Engines {
  '.ejs': typeof EjsTemplate
  '.liquid': typeof LiquidTemplate
  '.md': typeof MdTemplate
  '.ulka': typeof UlkaTemplate
  default: typeof Template
  [key: string]: typeof Template
}

export const engines: Engines = {
  '.ejs': EjsTemplate,
  '.liquid': LiquidTemplate,
  '.md': MdTemplate,
  '.ulka': UlkaTemplate,
  default: Template,
}

export { MdTemplate, EjsTemplate, LiquidTemplate, UlkaTemplate, Template }

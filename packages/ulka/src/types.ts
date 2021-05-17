// TODO: import later
type Ulka = any
type Template = any

export interface ContentConfig {
  forEach: (temp: Template, index: number, temps: Template[]) => any
  sort: (a: Template, b: Template) => any
  match: string | string[]
  ignore: string[]
}

export type PluginConfig =
  | string
  | { plugin: string; options: { [key: string]: any } }

export interface Configs {
  input: string
  output: string
  layout: string
  include: string
  contents: { [key: string]: ContentConfig }
  verbose: boolean
  plugins: PluginConfig[]
}

type PluginFunction = (arg: { ulka: Ulka; [key: string]: any }) => any

export interface Plugins {
  afterSetup: PluginFunction[]

  beforeBuild: PluginFunction[]
  afterBuild: PluginFunction[]

  beforeRender: PluginFunction[]
  afterRender: PluginFunction[]
  beforeWrite: PluginFunction[]
  afterWrite: PluginFunction[]
}
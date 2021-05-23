import type { Ulka } from './Ulka'
import type { Template } from './Templates/Template'

export interface ContentConfig {
  forEach: (temp: Template, index: number, temps: Template[]) => any
  sort: (a: Template, b: Template) => any
  match: string | string[]
  ignore: string[]
  layout: Function | string | null
  link: Function | string | null
}

export type PluginConfig =
  | string
  | { plugin: string; options: { [key: string]: any } }

export interface Configs {
  /**
   * Input is the root of the contents.
   *
   * if you have the following code in your contents config.
   *
   * ```js
   * blog: {
   *    match: "blog/**"
   * }
   * ```
   *
   * ulka will look for `blog/**` inide `input` directory
   */
  input: string
  output: string
  layout: string
  include: string
  contents: { [key: string]: ContentConfig }
  verbose: boolean
  /**
   * ## Array of plugins
   *
   * @example
   * ```js
   * [
   *     "./local-plugin",
   *    "@ulkajs/plugin-sass",
   *     {
   *        plugin: "@ulkajs/plugin-something",
   *        options: {}
   *     }
   * ]
   * ```
   */
  plugins: PluginConfig[]
  /**
   * Enabling this will allow you to write liquid syntax
   * in some frontmatter like `_link`, `_layout`
   */
  liquidInSpecialFrontMatter: boolean
}

export type PluginFunction = (arg: { ulka: Ulka; [key: string]: any }) => any

export interface Plugins {
  afterSetup: PluginFunction[]

  beforeBuild: PluginFunction[]
  afterBuild: PluginFunction[]

  beforeRender: PluginFunction[]
  afterRender: PluginFunction[]
  beforeWrite: PluginFunction[]
  afterWrite: PluginFunction[]
}

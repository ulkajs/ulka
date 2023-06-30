import type { Ulka } from './Ulka'
import type { Template } from './Templates/Template'

export interface ValidContentConfig {
  forEach: (temp: Template, index: number, temps: Template[]) => any
  sort: (a: Template, b: Template) => any
  match: string | string[]
  ignore: string[]
  layout: ((temp: Template) => string) | string | null
  link: ((temp: Template) => string) | string | null
}

export type ContentConfig = Partial<ValidContentConfig>

export type PluginConfig =
  | string
  | { plugin: string; options: { [key: string]: any } }
  | Plugin

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
   * ## Array of globs to copy
   *
   * This is useful when you don't need something as a template
   *
   * For example:
   * If you pass `**.png` to contents png, files will be treated as a template
   * and will be added to respective collection.
   * But passing `**.png` to copy will just copy the png files to the build folder
   * and no collection will be created
   *
   * @example
   * copy: ["**.{png,css,jpeg}", "fav.ico", { match: ["temporary/**"], output: (p) => p + ".tmp" }]
   *
   */
  copy: (
    | { match: string[] | string; output: (path: string) => string }
    | string
    | string[]
  )[]

  metaData: { [key: string]: any }
  concurrency: number
}

export type PluginName =
  | 'afterSetup'
  | 'beforeBuild'
  | 'afterBuild'
  | 'beforeCreateContext'
  | 'afterCreateContext'
  | 'beforeRender'
  | 'afterRender'
  | 'beforeWrite'
  | 'afterWrite'

export type PluginArg<T extends PluginName> = T extends
  | 'beforeRender'
  | 'afterRender'
  | 'beforeWrite'
  | 'afterWrite'
  | 'beforeCreateContext'
  | 'afterCreateContext'
  ? { template: Template; ulka: Ulka }
  : { ulka: Ulka }

export type PluginFunction<T extends PluginName = any> = (
  arg: PluginArg<T>
) => any

export type PluginsList = {
  [key in PluginName]: PluginFunction<key>[]
}

export type Plugin<T = any> = (options: T) => Partial<
  {
    [key in PluginName]: PluginFunction<key>
  }
>

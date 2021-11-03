import os from 'os'
import path from 'path'
import c from 'ansi-colors'
import chokidar from 'chokidar'

import { UlkaError } from './UlkaError'

import type { Ulka } from './Ulka'
import type {
  Configs,
  ContentConfig,
  PluginConfig,
  Plugins,
  PluginName,
  ValidContentConfig,
  PluginArg,
} from './types'

export function getNetworkAddress() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const intrfce of interfaces[name]!) {
      const { address, family, internal } = intrfce
      if (family === 'IPv4' && !internal) {
        return address
      }
    }
  }
  return 'Not Found'
}

export function box(str: string, padding = 3, fn: Function = c.green) {
  const ch = {
    e: ' ',
    top: fn('─'),
    left: fn('│'),
    right: fn('│'),
    bottom: fn('─'),
    topLeft: fn('╭'),
    topRight: fn('╮'),
    bottomLeft: fn('╰'),
    bottomRight: fn('╯'),
  }

  const arr = str.split('\n').map((v, i, a) => {
    return i !== 0 && i !== a.length - 1 ? ch.e.repeat(padding) + v : v
  })

  const max = Math.max(...arr.map((l) => c.unstyle(l).length)) + padding

  return arr
    .map((l, i) => {
      const length = c.unstyle(l).length

      let left = ch.left
      let right = ch.right
      let space = ch.e.repeat(max - length)

      if (i === 0) {
        left = ch.topLeft
        right = ch.topRight
        space = ch.top.repeat(max - length)
      }

      if (i === arr.length - 1) {
        left = ch.bottomLeft
        right = ch.bottomRight
        space = ch.bottom.repeat(max - length)
      }

      return left + l + space + right
    })
    .join('\n')
}

export const readConfigs = (ulka: Ulka) => {
  const cwd = ulka.cwd
  const cpath = path.join(cwd, ulka.configpath)

  let req: { [key: string]: any } = {}
  try {
    const r = require(cpath)
    if (typeof r === 'function') req = r(ulka)
    else req = r
  } catch (e: any) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      console.log(e.message)
      console.log(c.red(`> Error on file: ${ulka.configpath}`))
    }
  }

  const configs: Configs = {
    input: path.join(cwd, req.input || '.'),
    output: path.join(cwd, req.output || '_site'),
    layout: path.join(cwd, req.layout || '_layouts'),
    contents: req.contents || {},
    verbose: req.verbose || false,
    plugins: req.plugins || [],
    copy: req.copy || [],
    metaData: req.metaData || {},
    concurrency:
      typeof req.concurrency === 'number' ? req.concurrency : Infinity,
  }

  return configs
}

export function resolvePlugin(pluginConfig: PluginConfig, ulka: Ulka) {
  let name = ''
  let options = {}
  let plugin: { [key: string]: any } = {}

  if (typeof pluginConfig === 'string') name = pluginConfig
  else if (typeof pluginConfig === 'object' && pluginConfig.plugin) {
    name = pluginConfig.plugin
    options = pluginConfig.options || {}
  } else if (typeof pluginConfig === 'function') {
    plugin = pluginConfig()
  }

  if (name) {
    try {
      const resolved = require.resolve(name, { paths: [ulka.cwd] })
      let req = require(resolved)
      if (req.default) req = req.default

      if (typeof req === 'function') {
        plugin = req(options)
      } else {
        console.log(
          c.redBright(`> ${name} exports ${typeof req} instead of function`)
        )
      }
    } catch (e: any) {
      if (e.code === 'MODULE_NOT_FOUND') {
        c.redBright(`> Can't resolve plugin ${name}`)
      } else {
        throw new UlkaError(
          `Error occured while resolving plugin ${name}`,
          e.message
        )
      }
    }
  }

  for (const p of Object.keys(plugin)) {
    const fn = async (...args: any) => {
      try {
        await plugin[p](...args)
      } catch (e: any) {
        throw new UlkaError(`Error while using plugin ${name}.${p}`, e.message)
      }
    }
    // @ts-ignore
    if (ulka.plugins[p]) ulka.plugins[p].push(fn)
  }
}

export function createValidContentConfig(
  config: ContentConfig
): ValidContentConfig {
  const match =
    typeof config.match !== 'string' && !Array.isArray(config.match)
      ? []
      : config.match

  return {
    match,
    sort: config.sort || (() => {}),
    forEach: config.forEach || (() => {}),
    ignore: Array.isArray(config.ignore) ? config.ignore : [],
    layout: config.layout || null,
    link: config.link || null,
  }
}

export async function runPlugins<T extends PluginName = any>(
  name: T,
  options: PluginArg<T>
) {
  for (const plugin of options.ulka.plugins[name]) {
    // @ts-ignore
    await plugin(options)
  }
}

export function clearConsole() {
  console.clear()
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  )
}

export function liveReloadScript() {
  return `<script>
if ('WebSocket' in window) {
  const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
  const address = protocol + window.location.host + window.location.pathname;
  const ws = new WebSocket(address);
      
  ws.addEventListener('message', e => {
    if(e.data === "reload"){
      location.reload()
    }else if(e.data === "reload-css"){
      const links = document.querySelectorAll("link[rel='stylesheet']")
      links.forEach(link => (link.href += ""))
    }else {
      console.log(e.data)
    }
  });
}else {
    console.warn("Your browser doesn't support websockets, so can't live reload")
}
</script>`
}

export function createWatcher(ulka: Ulka) {
  return chokidar.watch(ulka.cwd, {
    ignoreInitial: true,
    awaitWriteFinish: {
      pollInterval: 25,
      stabilityThreshold: 100,
    },
    ignored: [
      '**/node_modules/**',
      '**/.vscode/**',
      '**/.git/**',
      '**/{package,package-lock,tsconfig}.json',
      '**/yarn.lock',
      ulka.configs.output,
    ],
    cwd: ulka.cwd,
  })
}

export function emptyPlugins(): Plugins {
  return {
    afterBuild: [],
    afterSetup: [],
    afterWrite: [],
    beforeBuild: [],
    beforeWrite: [],
    afterRender: [],
    beforeRender: [],
    afterCreateContext: [],
    beforeCreateContext: [],
  }
}

export function defineConfig(configs: Configs | ((ulka: Ulka) => Configs)) {
  return configs
}

export function paginate<T = any>(items: T[], size = 10) {
  const total = Math.ceil(items.length / size)

  let prev: T[] = []
  let current = items.slice(0, size)

  const all = []
  for (let i = 1; i <= total; i++) {
    const next = items.slice(i * size, (i + 1) * size)

    all[i - 1] = {
      current,
      page: i,
      total,
      prev: prev.length > 0 ? prev : null,
      next: next.length > 0 ? next : null,
    }

    prev = current
    current = next
  }

  return all
}

export function cleanLink(p: string) {
  let link = p.replace(/\\/g, '/').replace(/index.html$/, '')

  link = link.startsWith('/') ? link : '/' + link
  link = link.endsWith('/') || path.extname(link) !== '' ? link : link + '/'
  return link
}

import os from 'os'
import path from 'path'
import c from 'ansi-colors'

import { UlkaError } from './UlkaError'

import type { Ulka } from './Ulka'
import type { Configs, ContentConfig, PluginConfig, Plugins } from './types'

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
}

export function box(str: string, padding = 3) {
  const ch = {
    e: ' ',
    top: c.green('─'),
    left: c.green('│'),
    right: c.green('│'),
    bottom: c.green('─'),
    topLeft: c.green('╭'),
    topRight: c.green('╮'),
    bottomLeft: c.green('╰'),
    bottomRight: c.green('╯'),
  }

  const arr = str.split('\n').map((v, i, a) => {
    return i !== 0 && i !== a.length - 1 ? ch.e.repeat(padding) + v : v
  })

  const max = Math.max(...arr.map((l) => c.unstyle(l).length)) + padding

  if (process.stdout.columns < max + padding) return str.split('\n').join('\n ')

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
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      console.log(e.message)
      console.log(c.red(`> Error on file: ${ulka.configpath}`))
    }
  }

  const configs: Configs = {
    input: path.join(cwd, req.input || '.'),
    output: path.join(cwd, req.output || '_site'),
    layout: path.join(cwd, req.layout || '_layouts'),
    include: path.join(cwd, req.include || '_includes'),
    contents: req.contents || {},
    verbose: req.verbose || false,
    plugins: req.plugins || [],
  }

  for (const name of Object.keys(configs.contents)) {
    configs.contents[name] = validContentConfig(configs.contents[name], name)
  }

  return configs
}

export function resolvePlugin(pluginConfig: PluginConfig, ulka: Ulka) {
  let name = ''
  let options = {}

  if (typeof pluginConfig === 'string') name = pluginConfig
  if (typeof pluginConfig === 'object' && pluginConfig.plugin) {
    name = pluginConfig.plugin
    options = pluginConfig.options || {}
  }

  const resolved = require.resolve(name, { paths: [ulka.cwd] })

  let plugin: { [key: string]: any } = {}
  try {
    const req = require(resolved)
    if (typeof req !== 'function')
      c.redBright(`> ${name} exports ${typeof req} instead of function`)

    plugin = req(options)
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      c.redBright(`> Can't resolve plugin ${name}`)
    } else {
      throw new UlkaError(
        `Error occured while resolving plugin ${name}`,
        e.message
      )
    }
  }

  for (const p of Object.keys(plugin)) {
    const fn = async (...args: any) => {
      try {
        await plugin[p](...args)
      } catch (e) {
        throw new UlkaError(`Error while using plugin ${name}.${p}`, e.message)
      }
    }
    // @ts-ignore
    if (ulka.plugins[p]) ulka.plugins[p].push(fn)
  }
}

function validContentConfig(conf: ContentConfig, cName: string): ContentConfig {
  if (typeof conf.match !== 'string' && !Array.isArray(conf.match)) {
    console.log(c.red(`> Please provide valid "match" for content ${cName}`))
    conf.match = []
  }

  return {
    match: conf.match,
    sort: conf.sort || (() => {}),
    forEach: conf.forEach || (() => {}),
    ignore: Array.isArray(conf.ignore) ? conf.ignore : [],
  }
}

export async function runPlugins(
  name: keyof Plugins,
  options: Parameters<Plugins[typeof name][0]>[0]
) {
  for (const plugin of options.ulka.plugins[name]) {
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

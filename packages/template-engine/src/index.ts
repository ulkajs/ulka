import fs from 'fs'
import vm from 'vm'
import path from 'path'

export interface Options {
  base: string
}

export { render }

function render(
  str: string,
  data: { [key: string]: any } = {},
  options: Options = { base: process.cwd() }
) {
  const ctx = vm.createContext({
    ...data,
    require: (path: string) => requireFunction(path, options),
    include: (path: string) => includeFunction(path, options, ctx),
    console: { log: console.log },
  })

  return renderInContext(str, ctx)
}

function renderInContext(str: string, ctx: vm.Context) {
  return str.replace(/\\?{{(.*?)}}/gs, (match, js, index) => {
    if (match[0] === '\\' && str[index - 1] !== '\\') {
      return match.slice(1)
    }

    let result = vm.runInContext(js, ctx)

    if (Array.isArray(result)) {
      result = result.join('')
    }

    return result || ''
  })
}

function requireFunction(requirePath: string, options: Options) {
  if (!options.base)
    throw new Error(`"base" option cannot be undefined or null.`)

  try {
    const req = require.resolve(requirePath, { paths: [options.base] })
    return require(req)
  } catch (err: any) {
    throw new Error(`Couldn't require ${requirePath}`)
  }
}

function includeFunction(
  includePath: string,
  options: Options,
  ctx: vm.Context
) {
  if (!options.base)
    throw new Error(`"base" option cannot be undefined or null`)

  const absIncPath = path.join(options.base, includePath)
  const tpl = fs.readFileSync(absIncPath, 'utf-8')

  patchRequireAndInclude(ctx, { base: path.dirname(absIncPath) })

  const data = renderInContext(tpl, ctx)

  patchRequireAndInclude(ctx, { base: options.base })

  return data
}

function patchRequireAndInclude(ctx: vm.Context, options: Options) {
  ctx.require = (path: string) => requireFunction(path, options)
  ctx.include = (path: string) => includeFunction(path, options, ctx)
}

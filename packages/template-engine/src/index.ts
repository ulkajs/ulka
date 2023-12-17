import fs from 'fs'
import vm from 'vm'
import path from 'path'

export interface Options {
  base: string
  component?: boolean
}

export { render }

function render(
  str: string,
  data: { [key: string]: any } = {},
  options: Options = { base: process.cwd(), component: false }
) {
  const ctx = vm.createContext({
    ...data,
    require: (path: string) => requireFunction(path, options),
    include: (path: string) => includeFunction(path, options, ctx),
    defineComponent: (path: string, name: string) =>
      defineComponentFunction(path, name, options, ctx),
    console: { log: console.log },
  })

  let res = renderInContext(str, ctx)

  if (options.component) res = withComponent(res, ctx)

  return res
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

  patchRequireAndInclude(ctx, { ...options, base: path.dirname(absIncPath) })

  const data = renderInContext(tpl, ctx)

  patchRequireAndInclude(ctx, { ...options, base: options.base })

  return data
}

function patchRequireAndInclude(ctx: vm.Context, options: Options) {
  ctx.require = (path: string) => requireFunction(path, options)
  ctx.include = (path: string) => includeFunction(path, options, ctx)
  ctx.defineComponent = (path: string, name: string) =>
    defineComponentFunction(path, name, options, ctx)
}

function defineComponentFunction(
  cmpPath: string,
  name: string,
  options: Options,
  ctx: vm.Context
) {
  if (!name) name = path.parse(cmpPath).name

  const absIncPath = path.join(options.base, cmpPath)
  const tpl = fs.readFileSync(absIncPath, 'utf-8')

  ctx[name] = (props: Record<string, any>) => {
    patchRequireAndInclude(ctx, { ...options, base: path.dirname(absIncPath) })

    const newCtx = vm.createContext(ctx)
    newCtx.props = props
    const data = renderInContext(tpl, newCtx)

    patchRequireAndInclude(ctx, { ...options, base: options.base })

    return data
  }
}

function withComponent(code: string, ctx: vm.Context) {
  const self = /<u-([a-z]+) ([a-zA-z ]*) *\/>/
  const sep = /<u-([a-z]+) *([a-zA-z ]*) *>(.*)<\/u-\1>/s

  code = code.replace(self, (_, name, pstr) => {
    const props = pstr.trim().split(' ').join(', ')
    return vm.runInContext(`${name}({ ${props} })`, ctx)
  })

  code = code.replace(sep, (_, name, pstr, children) => {
    let props = pstr.trim().split(' ').join(', ')
    children = children.trim()

    if (props !== '') props += ', '

    props += 'children: `' + children + '`'

    return vm.runInContext(`${name}({ ${props} })`, ctx)
  })

  return code
}

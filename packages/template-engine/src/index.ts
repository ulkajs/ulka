import fs from 'fs'
import vm from 'vm'

export interface Options {
  base: string
}

export { render }

function render(
  str: string,
  data: { [key: string]: any } = {},
  options: Options = { base: process.cwd() }
) {
  const ctx = vm.createContext(context(data, options))

  return str.replace(/\\?{%(.*?)%}/gs, (match, js, index) => {
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

function context(ctx: any, options: Options) {
  return {
    ...ctx,
    include: (path: string) => includeFunction(path, options),
    console,
  }
}

function includeFunction(requirePath: string, options: Options) {
  if (!options.base) throw new Error(`"base" is a required option.`)

  let req = ''
  try {
    req = require.resolve(requirePath, { paths: [options.base] })
  } catch (err) {
    throw new Error(`Couldn't require ${requirePath}`)
  }

  try {
    return require(req)
  } catch (e) {
    return fs.readFileSync(req, 'utf-8')
  }
}

import path from 'path'
import c from 'ansi-colors'

import { build, watch, setup } from './index'

export const run: (...args: any[]) => Promise<void> = async ({
  watch: shouldWatch,
  configPath,
  cwd,
  port: p,
  log: vrbse,
}) => {
  cwd = path.join(process.cwd(), cwd)

  const ulka = await setup(cwd, shouldWatch ? 'watch' : 'build', configPath)

  ulka.configs.verbose = vrbse

  if (!shouldWatch) {
    return await build(ulka)
  }

  const port = +p

  if (isNaN(p)) {
    console.log(c.redBright.bold(`> Given port ${p} is not a valid port`))
    process.exit(0)
  }

  ulka.port = port
  await ulka.server.findPort()

  await watch(ulka, vrbse)

  ulka.server.listen()
}

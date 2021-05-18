import path from 'path'
import c from 'ansi-colors'
import { program } from 'commander'

import { build, watch, setup } from './index'

const pkgJson = require('../package.json')

// disable color if DISABLE_COLOR env is true
c.enabled = !process.env.DISABLE_COLOR

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

export function commander() {
  program
    .option('-w --watch [boolean]', 'create live server and watch files', false)
    .option('-c --config-path [string]', 'path to config', 'ulka-config.js')
    .option('-d --cwd [string]', 'project directory', '.')
    .option('-p --port [string]', 'server port', '8000')
    .option('-l --log [boolean]', 'verbose logs', false)
    .action(run)

  program.configureHelp({
    optionTerm: (op) => c.bold.cyan(op.flags),
    optionDescription: (op) => c.dim(op.description),
  })

  program.configureOutput({
    outputError: (err, write) =>
      write(
        c.redBright.bold('> ') +
          err +
          `\nUse ulka --help to see available options\n`
      ),
  })

  program.addHelpText(
    'afterAll',
    `
${c.yellow('Github')}: https://github.com/ulkajs/ulka/
${c.blueBright('Website')}: https://ulka.js.org/
`
  )
  program.name(pkgJson.name).description(pkgJson.description)
  program.version(pkgJson.version, '-v --version')
  program.parse(process.argv)
}
